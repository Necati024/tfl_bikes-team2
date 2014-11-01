

Install MongoDB:
http://www.mongodb.org/dr//fastdl.mongodb.org/osx/mongodb-osx-x86_64-2.6.5.tgz/download
-download this file, locate unzip it to any directory of your preference.mine is on desktop.
-open terminal
-cd into /Desktop/mongodb-osx-x86_64-2.6.5/bin
-From the bin directory, type the following in the terminal:
./mongod --dbpath /Users/NecatiMunir/Desktop/tfl_bikes-team2/nodetest1/data
-open a new tab on terminal and when you run mongo it should work

cd into nodetest1 of the tfl_bike-team2 folder and run npm start
go to http://localhost:3000/stationdetails
  you will see the table

all of these are done in the index.js file which is in the routes folder.
Randomized data are added into the database.
If you wanna acces the data in code you can acces wrtiing this on the index.js file
  Station.find(function(err,details{
  if(err)return console.error(err)

  }));
  all the information is put into the details array



If you type mongo on terminal you can acess the db.
  -show dbs :shows all the dbs on your local.
  -use dbsname: you use a specific db
     in our case you wanna do use BikesData
  -show collections: will show you the collections in that database 
   -bikesstations is the collection that has the desired table 
  - if you type db.bikestations.find().pretty(), you will se the data(**first run the webstie so it populates and creates the database on mongo)
  I used a nested shcema the structure looks like this 
  {
	"_id" : ObjectId("545209730409edb648c5d3b7"),
	"stationName" : "Baker Street",
	"details" : [
		{
			"time" : "1",
			"amount" : 9,
			"cap" : 11,
			"persent" : 0.8181818181818182,
			"status" : 0,
			"_id" : ObjectId("545209730409edb648c5d3b8")
		}
	],
	"__v" : 0
}
 Each station has a schema showing :
   -the time duration(12:00 to 13:00), 
   - the amoutn of bikes available
   - the total capacity
   - the percentage which is amount/cap (Called it persent on the table, dun ask why)
   -status, the value to determine if there is need of bikes or need od bikes to be taken away.

   these are the endpoint that you will use for the 


