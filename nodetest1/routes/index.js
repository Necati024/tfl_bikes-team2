var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});



/* GET Userlist page. */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema

   

  var  tableSchema =new mongoose.Schema({
     id:Number,
     name:String,
     terminalName:String,
     lat:String,
     longd:Number,
     installed:String,
     locked:String,
     installDate:Number,
     removalDate:String,
     temporary:String,
     nbBikes:Number,
     nbEmptyDocks:Number,
     nbDocks:Number,
     stations_Id:Number

  })
var  detailSchema= new mongoose.Schema({
     time:String,
     amount:Number,
     cap:Number,
     persent:Number,
     status:Number
});




var stationSchema = new mongoose.Schema({
    stationName:String,
    details:[detailSchema]
});

var Station=mongoose.model('bikeStation', stationSchema); 
 module.exports={
     Station:Station
     }

var StationTable=mongoose.model('stationtable', tableSchema); 
 module.exports={
     StationTable:StationTable
     }

var index=0;
for(index=0; index<40; index++){

 var capacity=Math.round(Math.random() * 35);
 var a=Math.round(Math.random() * capacity);
 var pecent=a/capacity;
  var s;
 if (pecent>0.85){
     s=1;
 }
 else if (pecent<0.15){
    s=-1;
 }
 else {
    s=0;
 }

 var Stations = ["Kings Cross", "Euston", "EversholtStreet","Penton Road","Camden","Covent Graden","Baker Street","Picadilly"];
 var data =new Station({
   stationName: Stations[Math.round(Math.random()*7)],
   details:
   [ {
     time:1 ,
     amount:a,
     cap:capacity,
     persent:pecent,
     status:s
     }
   ]
});
  data.save(function(err, dat) {
  if (err) return console.error(err);
  console.dir(dat);
});
}


router.get('/stationdetails', function(req, res) {
  Station.find({},{},function(err,details){
       if(err)return console.error(err);
        
       res.render('stationdetails', {
            "stationdetails" : details
        });
        
        

 });
 

  });

module.exports = router;
 

/* GET Station Table page. */
router.get('/stationtable', function(req, res) {
           
         
           
           StationTable.find({}, {"id":1, "name":1, "lat":1, "longd":1} ,function(err,stationtable){
                           
                           res.render('stationtable', {
                                      "stationtable" : stationtable
                                      });
                           
                           });
           
           });





module.exports = router;