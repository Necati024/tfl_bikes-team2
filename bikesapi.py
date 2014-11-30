import datetime
import random
import os

from flask import *
from flask.ext.pymongo import PyMongo

app = Flask(__name__)

if "MONGOHQ_URL" in os.environ:
    app.config["MONGO_URI"] = os.environ["MONGOHQ_URL"]
else:
    app.config["MONGO_PORT"] = 27019

app.config["MONGO_DBNAME"] = "bikesdata"
mongo = PyMongo(app)

MONGO_TIME_FORMAT = "%Y-%m-%d %H:%M:%S"

JOURNEY_TIME = datetime.timedelta(minutes=30)

def get_state(cap, usage):
    prop = usage / float(cap)
    if prop < 0.15:
        return -1
    if prop < 0.85:
        return 0
    return 1

class Van(object):
    def __init__(self, location):
        self.route = {}
        self.visited = set()
        self.current_location = location
        self.current_state = 0

    def add_snapshot(self, time, snapshot):
        self.route[time.strftime("%H:%M")] = snapshot
        self.visited.add(snapshot.id)

    def move_to(self, station, time):
        snapshot = station.snapshot(time)
        self.route[time.strftime("%H:%M")] = snapshot
        self.current_location = station.location
        self.current_state = snapshot.state
        self.visited.add(station.id)

    def to_json(self):
        return {time: snapshot.to_json() for (time, snapshot) in self.route.items()}

class StationSnapshot(object):
    def __init__(self, id, location, capacity, usage, time):
        self.id = id
        self.location = location
        self.capacity = capacity
        self.usage = usage
        self.time = time

    def status(self):
        return get_state(self.capacity, self.usage)

    def to_json(self):
        return {
            "station_id": self.id,
            "latitude": self.location[0],
            "longitude": self.location[1],
            "station_status": self.status(),
            "capacity": self.capacity,
            "usage": self.usage,
        }

    def copy(self):
        return StationSnapshot(
            self.id, self.location, self.capacity, self.usage, self.time)

class Station(object):
    def __init__(self, id, location):
        self.id = id
        self.location = location
        self.snapshots = []

    def add_state(self, time, capacity, usage):
        state = get_state(capacity, usage)

        self.snapshots.append(
            StationSnapshot(self.id, self.location, capacity, usage, time))
        self.snapshots.sort(key=lambda a: a.time)

    def snapshot(self, time):
        for i, curr in enumerate(self.snapshots):
            if curr.time < time:
                continue

            if i == 0:
                return curr
            prev = self.snapshots[i-1]

            prop = (time - prev.time).total_seconds() / (curr.time - prev.time).total_seconds()
            usage = int(prev.usage + prop * (curr.usage - prev.usage))

            return StationSnapshot(self.id, self.location, prev.capacity,
                                   usage, time)

        return self.snapshots[-1]

def find_next_station(van, snapshots):
    van_loc = van.current_location
    valid_stations = [s for s in snapshots if s.status() == van.current_state \
                      and s.status() != 0]
    closest_distance = 1 << 32
    closest_station = None
    for station in snapshots:
        if station.location == van_loc:
            continue

        stat_loc = station.location

        distance = (stat_loc[0] - van_loc[0]) * (stat_loc[0] - van_loc[0]) + \
                   (stat_loc[1] - van_loc[1]) * (stat_loc[1] - van_loc[1])
        if distance < closest_distance:
            closest_distance = distance
            closest_station = station
    return closest_station

def load_stations(start_time, end_time):
    station_ids = mongo.db.stationtable.distinct("id")

    time_query = {
        "$gt": start_time.strftime(MONGO_TIME_FORMAT),
        "$lt": end_time.strftime(MONGO_TIME_FORMAT),
    }

    stations = []
    for sid in station_ids:
        record = mongo.db.stationtable.find_one({"id": sid})

        loc = (record["lat"], record["longd"])
        station = Station(sid, loc)

        query = {"id": sid, "time": time_query}
        for record in mongo.db.stationtable.find(query):
            capacity = record["cap"]
            usage = record["amount"]
            time = datetime.datetime.strptime(record["time"], MONGO_TIME_FORMAT)

            station.add_state(time, capacity, usage)

        if not station.snapshots:
            continue
        stations.append(station)
    return stations

@app.route("/v1/route", methods=["GET"])
def route_vans():
    try:
        n_vals = int(request.values.get("n", 1))
    except ValueError:
        return "Require numeric n", 400

    try:
        start_time_epoch = int(request.values.get("date", 0))
    except ValueError:
        return "Require numeric date", 400

    start_time = datetime.datetime.fromtimestamp(start_time_epoch)
    end_time = start_time + JOURNEY_TIME * 24

    stations = load_stations(start_time, end_time)

    stations = [s for s in stations if s.snapshots]
    if not stations:
        abort(404)

    vans = []
    for _ in range(n_vals):
        start_station = random.choice(stations)
        vans.append(Van(start_station.location))

    current_time = start_time

    stations = load_stations(current_time, end_time)

    while current_time <= end_time:
        print "Running for", current_time.strftime(MONGO_TIME_FORMAT)
        snapshots = [s.snapshot(current_time) for s in stations]
        for van in vans:
            v_stations = [s for s in snapshots if s.id not in van.visited]
            next_station = find_next_station(van, v_stations)
            if not next_station:
                raise RuntimeError("Could not find next station")

            van.add_snapshot(current_time, next_station)
            van.current_location = next_station.location
            van.current_status = next_station.status()
        current_time += JOURNEY_TIME

    return jsonify({
        "routes": [v.to_json() for v in vans]
    })

@app.route("/v1/station/<sid>")
def station_info(sid):
    if sid == "all":
        sids = mongo.db.stationtable.distinct("id")
    else:
        try:
            sids = [int(sid)]
        except ValueError:
            abort(400)

    stations = []
    for sid in sids:
        station = mongo.db.stationtable.find_one({"id": sid})
        stations.append({
            "id": station["id"],
            "name": station["name"],
            "latitude": station["lat"],
            "longitude": station["longd"]
        })
    return jsonify({
        "stations": stations
    })

if __name__ == "__main__":
    app.run(debug=True)
