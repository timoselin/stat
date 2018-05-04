var router = require('express').Router();

var Title = require('./title');
var DataEntry = require('./dataentry');


router.param('title', function(req, res, next, title) {
  var query = Title.findOne({'trimTitle': title});
  query.exec(function (err, title){
    if (err) { return next(err); }
    if (!title) { return next(new Error('can\'t find title')); }

    req.title = title;
    return next();
  });
});

router.get('/inserts/:title', function(req, res, next) {
  req.title.populate('dataEntry', function(err, title) {
	  if (err) { return next(err); }
    res.json(title.dataEntry);
  });
});

router.post('/inserts/:title/dataset', function(req, res, next) {
  if(!req.body || req.body.length == 0 || req.body.key == '' || req.body.val == NaN) {
		res.status(400);
    res.send();
		return next();
	}
  if(req.body.date == '') {
    req.body.date = new Date();
  }

  var dataEntry = new DataEntry(req.body);
  dataEntry.title = req.title;

  // check that key in req.body is one of the keyTable keys
  var found = false;
  for (var i = 0; i < dataEntry.title.keyTable.length; i++) {
    if (dataEntry.key === dataEntry.title.keyTable[i]) {
      found = true;
      break;
    }
  }
  if(found == false) {
    res.status(409);  // Conflict
    res.send();
    return next();
  }

  dataEntry.save(function(err, dataset){
    if(err){ return next(err); }

    req.title.dataEntry.push(dataset);
    req.title.save(function(err, title) {
      if(err){ return next(err); }

      res.json(dataset);
    });
  });
});

exports = module.exports = router;
