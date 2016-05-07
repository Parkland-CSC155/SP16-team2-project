var http = require("http");
var express = require('express');
var app = express();            //creates an express application
var routes = require('./routes');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var userDb = require('./datasets');
var bodyParser = require('body-parser');
var path = require("path");
var logger = require("morgan");
//Lets define a port we want to listen to
var PORT = process.env.port || 3000;
var sql = require('mssql');

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
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// The app.locals object has properties that are local variables within the application.
app.locals.pagetitle = "Nutrition Database ";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

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
    req.session.object = [];
    
    res.render('calculator', {
       title: 'Calculator Page'
    });
});

//route that adds and searches the food in the database
app.get('/calculator/add', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
    
    
    res.render('food', {
        title: 'Adding Ingredients',
        search: 'Search the database for food',
        searchArray: req.session.searchArray,
        incart: "Items in the cart",
        cart: req.session.Ingredients,
        serving: req.session.servings,
        object: req.session.object,
        total: "Total:",
        totalCal: 0,
        totalPro: 0,
        totalSugar: 0,
        totalCarbs: 0
     
    });
});

//adds to the cart
app.post("/calculator/food", function(req, res, next){
  var food = req.body.food;
  var amount = req.body.amount;
  
  for(var i = 0; i < req.session.searchArray.length; i++)
  {
    var str1 = '' + food;
    var str2 = '' + req.session.searchArray[i].name;
    var n = str1.localeCompare(str2);
    if(n == 0)
    {
      req.session.object.push(req.session.searchArray[i]);
    }
  }
  
  //console.log("food:" + food);
  console.log(req.session.object);
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
app.post("/calculator/form", function(req, res, next){
  var connectionString = process.env.SQLCONNSTR_MS_TableConnectionString;
  var searchDB = req.body.searchDB;
  req.session.searchArray = [];
  
    sql.connect(connectionString).then(function () {
       var sqlStr = `
                SELECT * 
                FROM NutritionData
                WHERE  Shrt_Desc LIKE '${searchDB}%'
                `;
        return new sql.Request().query(sqlStr).then(function (recordset) {
        //console.log(recordset[0]);
        //console.dir(recordset);
	
        var data=[];
        var data1=[];
        var data2=[];
        var data3=[];
        var data4=[]; 

        for(var i = 0; i < recordset.length; i++)
        {
          var a = recordset[i].Shrt_Desc;
          var a1 = recordset[i].Energ_Kcal;
          var a2 = recordset[i]['Protein_(g)'];
          var a3 = recordset[i]['Carbohydrt_(g)'];
          var a4 = recordset[i]['Sugar_Tot_(g)'];
          
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
        }
        
        console.log(req.session.searchArray[0]);
        req.session.save( function(err) {
            req.session.reload( function (err) {
              res.redirect("/calculator/add"); });
      });
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
    });
} else {

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
    });
}

app.get('*', function (req, res) {
  res.send('Bad Route');
});

// Create a server
// Binds and listens for connections on the specified host and port
// and returns an http.Server object
var server = http.createServer(app);
server.listen(PORT, function(){
   console.log("app listening on port: " + PORT);  
});