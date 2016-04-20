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

router.get("search", function(req, res){
    res.send("Hello World");       

    var nutriSql = ` 
                SELECT * from NutritionData
                WHERE  NDM_NO BETWEEN "01001" AND "01025" 
                `; 
    db.all(nutriSql, "USA", function(nutriErr, nutriRows){ 
            if(nutriErr) 
                console.error(nutriErr);  
                
            console.log(nutriRows); 
    });
});

router.get("list", function(req, res){
    res.send("Hello World");
});