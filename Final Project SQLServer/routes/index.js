var express = require("express");
var router = express.Router();
var app = express();
const APIKEY = 'abcd'; // some unique value that attackers cannot guess
//var sqlite3 = require('sqlite3').verbose();
var mssql = require('mssql');
//var db = new sqlite3.Database('./datasets/nutrition.db');
//var db = new mssql.Database('sqlnutrition.database.windows.net/nutritondb.db'); 
var config = {
    user: '...',
    password: '..',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'sqlnutrition.database.windows.net/nutritondb.db',
    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
}

var connection = new sql.Connection(config, function(err) {
    // ... error checks
    // Query
    var request = new sql.Request(connection); // or: var request = connection.request();
    request.query('select 1 as number', function(err, recordset) {
        // ... error checks

        console.dir(recordset);
    });
});
exports.index = function (req, res) {
    //res.send("hello World");
    res.render('default', {
        title: 'Home',
        user: req.user
    });
};

exports.home = function (req, res) {
    var sqlString = "", len;
    var pgNum = req.query.page || 1;
    console.log("page number is " + pgNum);
    var searchText = req.query.searchText;
    console.log("search text is " + searchText);
    pgNum = Number(pgNum);
    var start = 25 * (pgNum - 1);
    var dbLength = "Select count(*) from NutritionData; ";
    
    if (searchText) {
        sqlString = "SELECT NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2 from NutritionData WHERE Shrt_Desc like '" + searchText +
            "%' order by Shrt_Desc limit 25 offset " + start + ";";
    } else {
        sqlString = "SELECT NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2 from NutritionData order by Shrt_Desc limit 25 offset " + start + ";";
    }
    db.all(sqlString, function (nutriErr, nutriRows) {
        if (nutriErr)
            console.error(nutriErr);
        db.get(dbLength, function (nutriErr, nutriRow) {
            if (nutriErr)
                console.error(nutriErr);
            
            len = nutriRow['count(*)'];
            console.log("len/25 is " + len/25);
            var numPages = Math.round(len/25);
            //res.send(nutriRows);
            res.render("index", {
                rows: nutriRows,
                page: pgNum,
                title: "Home",
                user: req.user,
                length: numPages
            });
        
        });
    });
};
exports.details = function (req, res) {
    var id = req.params.id;
    console.log("id is " + id);
    var sqlStr = "SELECT NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2, [Water_(g)], [Energ_Kcal], "
               + "[Protein_(g)], [Carbohydrt_(g)], [Fiber_TD_(g)], [Sugar_Tot_(g)], [FA_Sat_(g)], "
               + "[Cholestrl_(mg)] from NutritionData WHERE NDB_No = '" + id + "'";
    db.get(sqlStr, function (nutriErr, nutriRow) {
        if (nutriErr)
            console.error(nutriErr);
        
        console.log(nutriRow);
        res.render("details", {
            row: nutriRow
        });
    });
};
exports.calculator = function (req, res) {
    res.render('calc', {
        title: 'Calculator Page'
    });
};

exports.add = function (req, res) {
    res.render('addFood', {
        title: 'Adding Ingredients',
        search: 'Search the database for food'
    });
};