var express = require('express');
var app = express();            //creates an express application
var routes = require('./routes');
var bodyParser = require('body-parser');
var api = require("./routes/api.js");
//Lets define a port we want to listen to
var PORT = process.env.port || 3000;

var sqlite3 = require('sqlite3').verbose();  
var db = new sqlite3.Database('./datasets/nutrition.db'); 

// Assigns / Sets view engine extension to ejs
app.set('view engine', 'ejs');

// The app.locals object has properties that are local variables within the application.
app.locals.pagetitle = "Nutrition Database ";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Retrieve the value of a setting with app.get().
app.get('/', routes.index);

// validate all requests to the /api -based routes
//app.get('/api', routes.api);

app.get('/calculator', routes.calculator);

app.use(express.static('public'));

//throws new TypeError('Router.use() requires middleware function but got a ' + gettype(fn));
//app.get("/api", require("./routes/api"));
app.use('/api', api);

app.get('*', function(req, res) {
  res.send('Bad Route');
});

// Create a server
// Binds and listens for connections on the specified host and port
// and returns an http.Server object
var server = app.listen(PORT, function() {
    
    //Callback triggered when server is successfully listening.
    console.log('Server listening on http://localhost:' + PORT);
}); 