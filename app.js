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

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
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
    saveUninitialized: false }));

var sess;

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Retrieve the value of a setting with app.get().
app.get('/', routes.index);
app.get('/home', routes.home);
// validate all requests to the /api -based routes

//calculator stuff
app.get('/calculator', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
    sess = req.session;
    sess.Ingredients = [];
    sess.calories = [3, 6, 19];
    console.log(sess);
    
    res.render('calc', {
       title: 'Calculator Page',
       cart: sess.Ingredients
    });
});

app.get('/calculator/add', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
    sess = req.session;
    sess.searchArray = ["yo"];
    
    res.render('addFood', {
       title: 'Adding Ingredients',
       search: 'Search the database for food',
       searchArray: sess.searchArray,
       incart: "items in the cart",
       cart: sess.Ingredients
    });
});

app.post("/calculator/food", function(req, res, next){
  var food = req.body.food
  sess = req.session;
  
  if (!food == '')
  {
    sess.Ingredients.push(food);
    console.log(sess.Ingredients);
  }
  
  res.redirect("/calculator/add");
});
//working on updating the db with this
app.post("/calculator/form", function(req, res, next){
  sess = req.session;
  var searchDB = req.body.searchDB;
  var amount = req.body.amount;
  var calcsql = "SELECT * from NutritionData WHERE  Shrt_Desc like '" + searchDB + "%'";
  
  db.all(calcsql, function(nutriErr, nutriRows){ 
            nutriRows.forEach(function (nutriRows) {  
            console.log(nutriRows.Shrt_Desc);
            var a = nutriRows.Shrt_Desc;
            sess.searchArray.push(a);
            // console.log(amount)
        })
    });
  

  
  res.redirect("/calculator/add");
});

app.get("/session-example", function(req, res, next){

// ensure that the data on the session
  //has been set for the first request
  
  if(!req.session.viewCount){
    req.session.viewCount = 0;
  }

  req.session.viewCount += 1;

  // store arbitrary data that you need between
  // requests, but is not important enough
  // to put into a database
  req.session.chosenIngredients = [
    { id: 1, qty: 3}
  ];
  
  console.log(req.session.chosenIngredients);
  res.send("View Count: " + req.session.viewCount);
});
/* Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });
*/
app.get('/login',
  function(req, res){
    res.render('login');
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/home');
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });
  
app.use("/api", require("./routes/api"));

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