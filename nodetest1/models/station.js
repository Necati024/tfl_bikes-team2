var router = express.Router();
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
 //find the data 
 Station.find(function(err,details){
       if(err)return console.error(err);

       res.render('userlist', {
            "userlist" : details
        });

 });

  });
module.exports = router;