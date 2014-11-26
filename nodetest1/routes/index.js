var express = require('express');
var router = express.Router();
var detailarray=0;
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
     time:String,
     lat:String,
     longd:String,
     status:Number,
     })




var stationSchema = new mongoose.Schema({
    id:Number,
    name:String,
    lat:String,
    longd:String,
    amount:Number,
    nbEmptyDocks:Number,
    cap:Number,
    time:String,
});

var Station=mongoose.model('bikeStation', stationSchema); 
 module.exports={
     Station:Station
     }

var StationTable=mongoose.model('stationtable', tableSchema); 
 module.exports={
     StationTable:StationTable
     }


StationTable.count({}, function( err, count){
    console.log( "Number of users:", count );
  if (count==0){
 Station.find({},{},function(err, details) {
  if (err) return console.error(err);
    //console.dir(details);
    console.dir(details);
    for (var i in details) {
      var percent= (details[i].amount)/(details[i].cap);
     var  status;
      
     if (percent>0.85){
      status=1;
      }
    else if (percent<0.15){
      status=-1;
     }
    else {
      status=0;
    }
    
      addData(details[i].id,details[i].name,details[i].time,details[i].lat,details[i].longd,status)
      
 
}
});
}
});
 
  function addData(p1,p2,p3,p4,p5,p6){

     var data =new StationTable({
      
    
       id:p1,
      name:p2,
      time:p3,
      lat:p4,
      longd:p5,
      status:p6
    });
data.save(function(err, dat) {
  if (err) return console.error(err);
  console.dir(dat);

});
 
}



    

module.exports = router;

/* GET Station Table page. */
router.get('/stationtable', function(req, res) {
           
         
           
           StationTable.find({}, {} ,function(err,stationtable){
                           
                           res.render('stationtable', {
                                      "stationtable" : stationtable
                                      });
                           
                           });
           
           });





module.exports = router;