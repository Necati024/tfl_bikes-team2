var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

/* GET Userlist page. */
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