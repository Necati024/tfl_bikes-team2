

Install MongoDB:
http://www.mongodb.org/dr//fastdl.mongodb.org/osx/mongodb-osx-x86_64-2.6.5.tgz/download
-download this file, locate unzip it to any directory of your preference.mine is on desktop.
-open terminal
-cd into /Desktop/mongodb-osx-x86_64-2.6.5/bin
-From the bin directory, type the following in the terminal:
./mongod --dbpath /Users/NecatiMunir/Desktop/tfl_bikes-team2/nodetest1/data

  -First copy the data.csv(live data) file into the bin directory.
  -Again from the bin directory, type the following in the terminal:
./mongoimport -d bikesdata -c bikestations --type csv --file data.csv --headerline
this will import the live data
-open a new tab on terminal and when you run mongo it should work

cd into nodetest1 of the tfl_bike-team2 folder and run npm start
go to http://localhost:3000/stationtable
  you will see the table

all of these are done in the index.js file which is in the routes folder.

If you wanna acces the data in code you can acces wrtiing this on the index.js file
  StationTable.find({}, {} ,{sort :{time: 1, id: 1}},function(err,stationtable){
  if(err)return console.error(err)

  }));
  all the information is put into the details array
  *Important* make sure you have ,{sort :{time: 1, id: 1}} when u retriving the data from the db 
  because it will sort the data in correct order.


If you type mongo on terminal you can acess the db.
  -show dbs :shows all the dbs on your local.
  -use dbsname: you use a specific db
     in our case you wanna do use bikesdata
  -show collections: will show you the collections in that database 
   -stationtables is the collection that has the desired table 
  - if you type db.stationtables.find().pretty(), you will se the data(**first run the webstie so it populates and creates the database on mongo)
 
{
	"_id" : ObjectId("54750afc925195b951396f96"),
	"id" : 20,
	"name" : "Drummond Street , Euston",
	"time" : "2014-11-25 16:48:05",
	"lat" : "51.52773634",
	"longd" : "-0.135273468",
	"status" : 0,
	"__v" : 0
}

 Each station has a schema showing :
  -Station Id
  -name
  -the time duration(12:00 to 13:00), 
  -Longtitude
  -Latitude
  -Status
 
