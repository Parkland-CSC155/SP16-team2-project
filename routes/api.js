var express = require("express");
var router = express.Router();
var app = express();          
const APIKEY = 'abcd'; // some unique value that attackers cannot guess
var sqlite3 = require('sqlite3').verbose();  
var db = new sqlite3.Database('./datasets/nutrition.db'); 

app.use(function(req, res, next){
   
   if(req.baseUrl !== "/api"){
       next();
       return;
   }
   
   // REQUEST: www.blah.com/api?apiKey=abcd
   var reqApiKey = req.query.apiKey;
   
   if(!reqApiKey){
        res.status(401);
        res.send("Missing API Key");
        return;   
   } 
   
   if(reqApiKey !== APIKEY){
        res.status(401);
        res.send("Invalid API Key");
        return; 
   }
    
   // all good at this point, so let the request move on through the pipeline
   next();
});

//- `/api/search/{searchText}?page={pageNumber}&apiKey={apiKey}` 
router.get("/search/:text", function(req, res){
    res.send("Search Text"); 
    var searchText = req.params.text;
    var nutriSql = "SELECT * from NutritionData WHERE  Shrt_Desc like '" + searchText +"%'";    
    db.all(nutriSql, function(nutriErr, nutriRows){ 
            if(nutriErr) 
                console.error(nutriErr);   
                             
            console.log(nutriRows); 
    });    
});

//- `/api/list?page={pageNumber}&apiKey={apiKey}`
router.get("/list", function(req, res){
    res.send("Listing");
    var pgNum = req.params.page;    
    var start = 25 * (pgNum - 1)  + 1;
    var end = start + 25;
    var sqlString = "SELECT * from NutritionData WHERE NDB_No BETWEEN " + start + "AND" + end;
    db.all(sqlString, function(nutriErr, nutriRows){ 
            if(nutriErr) 
                console.error(nutriErr); 
                                 
            console.log(nutriRows); 
    });    
});

//- `/api/{id}&apiKey={apiKey}` 
router.get("/:id", function(req, res){
    res.send("id");
    var id = req.params.id;
    var sqlStr = "SELECT * from NutritionData WHERE NDB_No = " + id;
    db.all(sqlStr, function(nutriErr, nutriRows){ 
            if(nutriErr) 
                console.error(nutriErr);     
                             
            console.log(nutriRows); 
    }); 
});