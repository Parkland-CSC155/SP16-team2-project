var express = require('express');
var app = express();            //creates an express application
var routes = require('./routes');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var userDb = require('./datasets');
var bodyParser = require('body-parser');

//var connectionString = process.env.MS_TableConnectionString;   //my db credentials
//Lets define a port we want to listen to
var PORT = process.env.port || 3000;

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./datasets/nutrition.db');

passport.use(new Strategy(function (username, password, cb) { //cb-callback
  userDb.users.findByUsername(username, function (err, user) {
    if (err) { return cb(err); }
    if (!user) { return cb(null, false); }
    if (user.password != password) { return cb(null, false); }
    return cb(null, user);
  });
}));

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  userDb.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Assigns / Sets view engine extension to ejs
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// The app.locals object has properties that are local variables within the application.
app.locals.pagetitle = "Nutrition Database ";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Retrieve the value of a setting with app.get().
app.get('/', routes.index);
app.get('/home', routes.home);
app.get('/calculator', routes.calculator);
app.get('/details/:id', routes.details);
app.get('/calculator/add', routes.add);

app.post("/calculator/form", function (req, res, next) {
  var searchDB = req.body.searchDB;
  console.log(searchDB);

  res.redirect("/calculator/add");
});
app.get("/session-example", function (req, res, next) {

  // ensure that the data on the session
  //has been set for the first request
  if (!req.session.viewCount) {
    req.session.viewCount = 0;
  }

  req.session.viewCount += 1;

  // store arbitrary data that you need between
  // requests, but is not important enough
  // to put into a database
  req.session.chosenIngredients = [
    { id: 1, qty: 3 }
  ];

  res.send("View Count: " + req.session.viewCount);
});
app.get('/login',
  function (req, res) {
    res.render('login');
  });

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/home'); // res.redirect('/home'); 
  });

app.get('/logout',
  function (req, res) {
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function (req, res) {
    res.render('profile', { user: req.user });
  });

app.use("/api", require("./routes/api"));

app.get('*', function (req, res) {
  res.send('Bad Route');
});

// Create a server
// Binds and listens for connections on the specified host and port
// and returns an http.Server object
var server = app.listen(PORT, function () {

  //Callback triggered when server is successfully listening.
  console.log('Server listening on http://localhost:' + PORT);
}); 