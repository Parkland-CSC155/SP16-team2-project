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

router.use(function (req, res, next) {
    if (req.baseUrl !== "/api") {
        res.send("no api");
        next();
        return;
    }

    // REQUEST: www.blah.com/api?apiKey=abcd
    var reqApiKey = req.query.apiKey;

    if (!reqApiKey) {
        res.status(401);
        res.send("Missing API Key");
        return;
    }

    if (reqApiKey !== APIKEY) {
        res.status(401);
        res.send("Invalid API Key");
        return;
    }
    console.log("api key entered is " + reqApiKey);
    // all good at this point, so let the request move on through the pipeline
    next();
});

// `/api/search/{searchText}?page={pageNumber}&apiKey={apiKey}` 
router.get("/search/:text", function (req, res) {
    var searchText = req.params.text;
    var pgNum = req.query.page || 1;
    console.log("page num is " + pgNum);
    pgNum = Number(pgNum);
    if (searchText) {
        var start = 25 * (pgNum - 1);
        var nutriSql = "SELECT NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2 from NutritionData WHERE Shrt_Desc like '" + searchText +
                       "%' order by Shrt_Desc limit 25 offset " + start;
        db.all(nutriSql, function (nutriErr, nutriRows) {
            if (nutriErr)
                console.error(nutriErr);

            res.json(nutriRows);
        });
    }
});

//- `/api/list?page={pageNumber}&apiKey={apiKey}`
router.get("/list", function (req, res) {

    var pgNum = req.query.page || 1;
    var start = 25 * (pgNum - 1);
    //SELECT * from NutritionData WHERE  Shrt_Desc like 'a%' order by NDB_No offset 25 rows fetch next 5 rows only
    //sql server --> var sqlString = "SELECT [Fiber_TD_(g)], [Cholestrl_(mg)] from NutritionData order by NDB_No offset " + start + " rows fetch next 25 rows only";
    //for sqlite
    var sqlString = "SELECT NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2 from NutritionData order by Shrt_Desc limit 25 offset " + start;

    db.all(sqlString, function (nutriErr, nutriRows) {
        if (nutriErr)
            console.error(nutriErr);

        res.json(nutriRows);
    });
});

//- `/api/{id}&apiKey={apiKey}` 
router.get("/details/:id", function (req, res) {
    var id = req.params.id;
    console.log("id is " + id);
    var sqlStr = "SELECT NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2 from NutritionData WHERE NDB_No = '" + id + "'";
    db.get(sqlStr, function (nutriErr, nutriRows) {
        if (nutriErr)
            console.error(nutriErr);

        res.json(nutriRows);
    });
});
module.exports = router;