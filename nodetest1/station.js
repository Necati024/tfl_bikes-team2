//var router = express.Router();
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

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
router.get('/stationdetails', function(req, res) {
  Station.find(function(err,details){
       if(err)return console.error(err);

       res.render('stationdetails', {
            "stationdetails" : details
        });

 });
 

  });

module.exports = router;
 