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

app.get('/details/:id', routes.details);


//calculator stuff
app.get('/calculator', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
    //setup the session
    req.session.searchArray = [];
    req.session.Ingredients = [];
    req.session.servings = [];
    
    //working on these
    req.session.cal = [];
    req.session.pro = [];
    req.session.sugar = [];
    req.session.carbs = [];
    
    res.render('calc', {
       title: 'Calculator Page'
    });
});

//route that adds and searches the food in the database
app.get('/calculator/add', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
            
    console.log("name:" + req.session.searchArray);        
    console.log('cal:' + req.session.cal);
    console.log('pro:' + req.session.pro);
    console.log('carb:' + req.session.sugar);
    console.log('sugar:' + req.session.carbs);   
    
    res.render('addFood', {
        title: 'Adding Ingredients',
        search: 'Search the database for food',
        searchArray: req.session.searchArray,
        incart: "items in the cart",
        cart: req.session.Ingredients,
        serving: req.session.servings,
       
       //working on these
        calories: req.session.cal,
        protein: req.session.pro,
        sugar: req.session.sugar,
        carbs: req.session.carbs
      
        
          
    });
});

//adds to the cart
app.post("/calculator/food", function(req, res, next){
  var food = req.body.food;
  var amount = req.body.amount;
  
  if (!food == '')
  {
    req.session.Ingredients.push(food);
    req.session.servings.push(amount);
  }
  
  req.session.save( function(err) {
            req.session.reload( function (err) {
              res.redirect("/calculator/add"); });
          });
  });

//working on updating the db with this
//its just adding the first one
//need to make it so there is
// copy this from the user
// var records = [
//     { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
//   , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
// ];
app.post("/calculator/form", function(req, res, next){
  
  var searchDB = req.body.searchDB;
  var calcsql = "SELECT * from NutritionData WHERE  Shrt_Desc like '" + searchDB + "%'";
  req.session.searchArray = [];
  db.all(calcsql, function(nutriErr, nutriRows){
            var data=[];
            var data1=[];
            var data2=[];
            var data3=[];
            var data4=[];
            
            nutriRows.forEach(function (nutriRows) {  
              
              var a = nutriRows.Shrt_Desc;
              var a1 = nutriRows.Energ_Kcal;
              var a2 = nutriRows['Protein_(g)'];
              var a3 = nutriRows['Carbohydrt_(g)'];
              var a4 = nutriRows['Sugar_Tot_(g)'];
              //making sure the data isnt null
              if (a1 == null){
                a1 = 0;
              }
              if (a2 == null){
                a2 = 0;
              }
              if (a3 == null){
                a3 = 0;
              }
              if (a4 == null){
                a4 = 0;
              }
              
              var item = {
                  name: a,
                  cal: a1,
                  pro: a2,
                  carbs: a3,
                  sugar: a4
              };
              
              req.session.searchArray.push(item);
              
                            
        })
        req.session.searchArray = data.slice();
        req.session.cal = data1.slice();
        req.session.pro = data2.slice();
        req.session.carbs = data3.slice();
        req.session.sugar = data4.slice();
        
        var data=[];
        var data1=[];
        var data2=[];
        var data3=[];
        var data4=[];
       
        
        req.session.save( function(err) {
            req.session.reload( function (err) {
              res.redirect("/calculator/add"); });
         });
     });
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