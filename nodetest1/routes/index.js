var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

/* GET Userlist page. */
<<<<<<< HEAD
=======
router.get('/userlist', function(req, res) {
           
    var db = req.db;
    var collection = db.get('stationcollection');
           
    var stationCount = new Array(777);
    for(var n=0; n<stationCount.length; n++)
    {
        stationCount[n] = 0;
    }
    
    collection.find({}, {"StartStation Id":1, "EndStation Id":1} ,function(e,journeys){
              
        for(var n=0; n<journeys.length; n++)
        {
            var startStation = journeys[n]['StartStation Id'];
            stationCount[startStation] = stationCount[startStation] - 1;
                    
            var endStation = journeys[n]['EndStation Id'];
            stationCount[endStation] = stationCount[endStation] + 1;
        }
                    
        res.render('userlist', {
            "userlist" : stationCount
        });
                           
    });
>>>>>>> FETCH_HEAD

/* GET Userlist page. */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema

  console.log("FUKC");
var  detailSchema= new mongoose.Schema({
     time:String,
     amount:String,
     cap:String,
     persent:String,
     status:String
});


var stationSchema = new mongoose.Schema({
    stationName:String,
    details:[detailSchema]
});

var Station=mongoose.model('Station', stationSchema); 
 module.exports={
     Station:Station
     }

 var data =new Station({
   stationName:'33',
   details:
   [ {
     time:'D',
     amount:'d',
     cap:'f',
     present:'f',
     status:'dsd'
     }
   ]
});

 data.save(function(err, dat) {
  if (err) return console.error(err);
  console.dir(dat);
});
router.get('/userlist', function(req, res) {
  Station.find(function(err,details){
       if(err)return console.error(err);

       

 });
 

  });

module.exports = router;
 

/* GET Station Table page. */
router.get('/stationtable', function(req, res) {
           
           var db = req.db;
           var collection = db.get('stationtable');
           
           collection.find({}, {"id":1, "name":1, "lat":1, "long":1} ,function(e,stationtable){
                           
                           res.render('stationtable', {
                                      "stationtable" : stationtable
                                      });
                           
                           });
           
           });

/* GET Station Details page. */
router.get('/stationdetails', function(req, res) {
           
           var db = req.db;
           var collection = db.get('stationdetails');
           
           collection.find({}, {"time":1, "bikes":1, "capacity":1, "status":1} ,function(e,stationdetails){
                           
                           res.render('stationdetails', {
                                      "stationdetails" : stationdetails
                                      });
                           
                           });
           
           });

/* GET Station Table page. */
router.get('/stationtable', function(req, res) {
           
           var db = req.db;
           var collection = db.get('stationtable');
           
           collection.find({}, {"id":1, "name":1, "lat":1, "long":1} ,function(e,stationtable){
                           
                           res.render('stationtable', {
                                      "stationtable" : stationtable
                                      });
                           
                           });
           
           });

/* GET Station Details page. */
router.get('/stationdetails', function(req, res) {
           
           var db = req.db;
           var collection = db.get('stationdetails');
           
           collection.find({}, {"time":1, "bikes":1, "capacity":1, "status":1} ,function(e,stationdetails){
                           
                           res.render('stationdetails', {
                                      "stationdetails" : stationdetails
                                      });
                           
                           });
           
           });

module.exports = router;