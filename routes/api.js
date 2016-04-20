var express = require("express");
var router = express.Router();

router.get("search", function(req, res){
    res.send("Hello World");
});

router.get("list", function(req, res){
    res.send("Hello World");
});

var nutriSql = ` 
             SELECT * from NutritionData
             WHERE  NDM_NO BETWEEN "01001" AND "01025" 
             `; 
db.all(nutriSql, "USA", function(cusErr, nutriRows){ 
         if(cusErr) 
             console.error(cusErr);  
              
         console.log(nutriRows); 
});
