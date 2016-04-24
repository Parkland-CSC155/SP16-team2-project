var express = require("express");
var router = express.Router();
var app = express();          
const APIKEY = 'abcd'; // some unique value that attackers cannot guess
var sqlite3 = require('sqlite3').verbose();  
var db = new sqlite3.Database('./datasets/nutrition.db'); 

app.use(function(req, res, next){
    res.send("inside app.use function");
    res.send('%s %s %s', req.method, req.url, req.path);
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
    console.log("api key entered is " + reqApiKey);   
    // all good at this point, so let the request move on through the pipeline
    next();
});

// `/api/search/{searchText}?page={pageNumber}&apiKey={apiKey}` 
router.get("/search/:text/page=:page", function(req, res){
   // res.send("Search Text"); 
    var searchText = req.params.text;    
    var pgNum = req.params.page || 1;  
    console.log("page num is " + pgNum); 
    pgNum = Number(pgNum);       
    var start = 25 * (pgNum - 1);
    var nutriSql = "SELECT * from NutritionData WHERE Shrt_Desc like '" + searchText +
                     "%' order by Shrt_Desc limit 25 offset " + start;     
    db.all(nutriSql, function(nutriErr, nutriRows){ 
            if(nutriErr) 
                console.error(nutriErr); 
                
            res.send(nutriRows);                             
            console.log(nutriRows); 
    }); 
});

//- `/api/list?page={pageNumber}&apiKey={apiKey}`//router.get("/list/:page", function(req, res){
router.get("/list/page=:page", function(req, res){
    //res.send("Listing");
    var pgNum = req.params.page || 1;
    console.log("page num is " + pgNum); 
    pgNum = Number(pgNum);
    var start = 25 * (pgNum - 1);
    //SELECT * from NutritionData WHERE  Shrt_Desc like 'a%' order by NDB_No offset 25 rows fetch next 5 rows only
    //sql server --> var sqlString = "SELECT * from NutritionData order by NDB_No offset " + start + " rows fetch next 25 rows only";
    //for sqlite
    var sqlString = "SELECT * from NutritionData order by NDB_No limit 25 offset " + start; 
 
    db.all(sqlString, function(nutriErr, nutriRows){ 
            if(nutriErr) 
                console.error(nutriErr); 
                
            res.send(nutriRows);                   
            console.log(nutriRows); 
    });    
});

//- `/api/{id}&apiKey={apiKey}` 
router.get("/:id", function(req, res){
    //res.send("inside id");
    var id = req.params.id;
    console.log("id is " + id);
    var sqlStr = "SELECT * from NutritionData WHERE NDB_No = '" + id + "'";
    db.get(sqlStr, function(nutriErr, nutriRows){ 
            if(nutriErr) 
                console.error(nutriErr);
                     
            res.send(nutriRows);              
            console.log(nutriRows); 
    }); 
});
module.exports = router;