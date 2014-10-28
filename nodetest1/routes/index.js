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
           collection.find({}, {"StartStation Id":1, "EndStation Id":1} ,function(e,docs){
                           
        res.render('userlist', {
            "userlist" : docs
        });
                           
    });
});

module.exports = router;