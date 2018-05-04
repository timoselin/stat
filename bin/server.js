// server.js

// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose	   = require('mongoose');

// configuration ===========================================
var route1 = require('../server/routes/Statistics/titleRoutes');
var route2 = require('../server/routes/Statistics/dataEntryRoutes');

// config files
var db = require('../server/config/db');

// set our port
var port = process.env.PORT || 3000;

// Set global mongoose promise library
mongoose.Promise = global.Promise;

// connect to your mongoDB database
mongoose.connect(db[app.settings.env], function (err, res) {
    if(err) {
        console.error('Failed to connect mongodb database: ' + db[app.settings.env])
        return;
    }
});

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(express.static(__dirname + "/../public")); 

// routes ==================================================
app.use('/', route1);
app.use('/', route2);

// start app ===============================================
app.listen(port);               
                  
console.log('Something happens on port ' + port);

// expose app           
exports = module.exports = app;                         
