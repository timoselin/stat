var router = require('express').Router();

var Title = require('./title');

var NUMBEROFCHAR = 30;  // Number of characters in trimTitle

function removeSpecialChars(str) {
  return str.replace(/(?!\w|\s)./g, '')  // remove any character that is not A-Z a-z 0-9_ or whitespace
    .replace(/\s/g, '_')  // replace whitespaces with '_'
    .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');  // remove any whitespace in the beginning or in the end
}

router.get('/inserts', function(req, res, next) {
  Title.find(function(err, titles){
    if(err){ return next(err); }
    res.json(titles);
  });
});

router.post('/inserts', function(req, res, next) {
	if(!req.body || req.body.length == 0) {
		res.status(400);
    res.send();
		return next();
	}
  if(req.body._id != undefined) {
    res.status(406);  // Not acceptable
    res.send();
    return next();
  }

  // Check that there are no identical keys
  var keyArray = req.body.keyTable;
  var isDuplicate = keyArray.some(function(item, idx){ 
    return keyArray.indexOf(item) != idx;
  });
  if(isDuplicate == true) {
    res.status(406);  // Not acceptable
    res.send();
    return next();
  }

  var tmpTitle = removeSpecialChars(req.body.title);

  var trimmedTitle = tmpTitle.substring(0, NUMBEROFCHAR);

  // check that trimmedTitle is unique
  var countQuery = Title.where({ 'trimTitle': trimmedTitle }).count();
  countQuery.exec(function (err, count) {
    if (err) { return next(err); }
    if(count > 0) {
      count += 1;
      trimmedTitle = trimmedTitle + count;
    }
    var title = new Title(req.body);
    title.dataEntry = [];
    title.trimTitle = trimmedTitle;

    title.save(function(err, title){
      if(err){ return next(err); }

      res.json(title);
    });
  });
});

exports = module.exports = router;
