

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


If you type mongo on terminal you can acess the db.
  -show dbs :shows all the dbs on your local.
  -use dbsname: you use a specific db
     in our case you wanna do use BikesData
  -show collections: will show you the collections in that database 
   -bikesstations is the collection that has the desired table 
