var express = require("express");
var router = express.Router();
var app = express();
const APIKEY = 'abcd'; // some unique value that attackers cannot guess
//var sqlite3 = require('sqlite3').verbose();
var sql = require('mssql');
//var db = new sqlite3.Database('./datasets/nutrition.db');
/*var db = new mssql.Database('sqlnutrition.database.windows.net/nutritondb.db'); 
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
});*/

exports.index = function (req, res) {
    //res.send("hello World");
    res.render('default', {
        title: 'Home',
        user: req.user
    });
};

exports.home = function (req, res) {
    var sqlString = "", len, dbTotLength = "";
    var pgPrev, PgOne, pgTwo, pgThree, pgFour, pgNext, pgFirst, pgLast;
    var pgNum = req.query.page || 1;
    console.log("page number is " + pgNum);
    var searchText = req.query.searchText;
    console.log("search text is " + searchText);
    pgNum = Number(pgNum);
    var skip = 25 * (pgNum - 1);

    var connectionString = process.env.MS_TableConnectionString;

    sql.connect(connectionString).then(function () {
        if (searchText) {
            sqlString = `
                SELECT  NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2
                FROM    NutritionData
                WHERE   Shrt_Desc LIKE '${searchText}'
                ORDER BY Shrt_Desc
                OFFSET  ${skip} ROWS
                FETCH NEXT 25 ROWS ONLY    
                    `;
            dbTotLength = `
                        SELECT count(*)
                        FROM   NutritionData
                        WHERE   Shrt_Desc LIKE '${searchText}'
                            `;
        } else {
            sqlString = `
                SELECT  NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2
                FROM    NutritionData
                ORDER BY Shrt_Desc
                OFFSET  ${skip} ROWS
                FETCH NEXT 25 ROWS ONLY    
                    `;
            dbTotLength = `
                SELECT count(*)
                FROM   NutritionData
                    `;
        }
        return new sql.Request().query(sqlString).then(function (recordset) {
            console.dir(recordset);
            var record = recordset[0];

            new sql.Request().query(dbTotlength).then(function (recordset1) {
                console.dir(recordset1);
                var record1 = recordset1[0];

                len = recordset1['count(*)'];
                console.log("len/25 is " + len / 25);
                var numPages = Math.round(len / 25);

                if (searchText) {
                    pgFirst = 1 + "&searchText=" + searchText;
                    pgLast = numPages + "&searchText=" + searchText;
                    pgOne = pgNum + '&searchText=' + searchText;

                    if (pgNum - 1 >= 1) pgPrev = pgNum - 1 + "&searchText=" + searchText;
                    else pgPrev = null;
                    if (pgNum + 1 <= numPages) pgTwo = pgNum + 1 + "&searchText=" + searchText;
                    else pgTwo = null;
                    if (pgNum + 2 <= numPages) pgThree = pgNum + 2 + "&searchText=" + searchText;
                    else pgThree = null;
                    if (pgNum + 3 <= numPages) pgFour = pgNum + 3 + "&searchText=" + searchText;
                    else pgFour = null;
                    if (pgNum + 1 < numPages) pgNext = pgNum + 1 + "&searchText=" + searchText;
                    else pgNext = null;

                } else {
                    pgFirst = 1;
                    pgLast  = numPages;
                    pgOne   = pgNum;

                    if (pgNum - 1 >= 1) pgPrev = pgNum - 1;
                    else pgPrev = null;
                    if (pgNum + 1 <= numPages) pgTwo = pgNum + 1;
                    else pgTwo = null;
                    if (pgNum + 2 <= numPages) pgThree = pgNum + 2;
                    else pgThree = null;
                    if (pgNum + 3 <= numPages) pgFour = pgNum + 3;
                    else pgFour = null;
                    if (pgNum + 1 < numPages) pgNext = pgNum + 1;
                    else pgNext = null;
                }

                res.render("index", {
                    rows:      nutriRows,
                    page:      pgNum,
                    title:     "Home",
                    user:      req.user,
                    length:    numPages,
                    text:      searchText,
                    pageFirst: pgFirst,
                    pagePrev:  pgPrev,
                    curpg:     pgOne,
                    pageTwo:   pgTwo,
                    pageThree: pgThree,
                    pageFour:  pgFour,
                    pageNext:  pgNext,
                    pageLast:  pgLast
                });
            });
        });
    })
        .catch(function (err) {
            console.log(err);
            next(err);
        });
}

exports.details = function (req, res) {
    var id = req.params.id;
    console.log("id is " + id);
    var connectionString = process.env.MS_TableConnectionString;

    sql.connect(connectionString).then(function () {
        sqlString = `
                SELECT  NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2, [Water_(g)], [Energ_Kcal], [Protein_(g)],"
                     + " [Carbohydrt_(g)], [Fiber_TD_(g)], [Sugar_Tot_(g)], [FA_Sat_(g)], [Cholestrl_(mg)]"
                FROM  NutritionData
                WHERE NDB_No = '" + ${id} + "'";
                    `;
        return new sql.Request().query(sqlString).then(function (recordset) {
            console.dir(recordset);
            var record = recordset[0];

            res.render("details", {
                row: record,
                user: req.user
            });
        });
    });
};
/*
//"Select count(*) from NutritionData ;"; 
//sqlString = "SELECT NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2 from NutritionData order by Shrt_Desc limit 25 offset " + start + ";";
//"Select count(*) from NutritionData WHERE Shrt_Desc like '" + searchText  + "%';";            
//sqlString = "SELECT NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2 from NutritionData WHERE Shrt_Desc like '" + searchText +
//  "%' order by Shrt_Desc limit 25 offset " + start + ";";
db.all(sqlString, function (nutriErr, nutriRows) {
    if (nutriErr)
        console.error(nutriErr);
    db.get(dbLength, function (nutriErr, nutriRow) {
        if (nutriErr)
            console.error(nutriErr);
        
        len = nutriRow['count(*)'];
        console.log("len/25 is " + len/25);
        var numPages = Math.round(len/25);
            if(searchText){
                var currentPg = "page&searchText=" + searchText; 
                var pgTwo = "page " + 1 + "&searchText=" + searchText; 
            }
        //res.send(nutriRows);
        res.render("index", {
            rows: nutriRows,
            page: pgNum,
            title: "Home",
            user: req.user,
            length: numPages
        });
    
    });
});*/
/*
    var sqlStr = "SELECT NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2, [Water_(g)], [Energ_Kcal], "
        + "[Protein_(g)], [Carbohydrt_(g)], [Fiber_TD_(g)], [Sugar_Tot_(g)], [FA_Sat_(g)], "
        + "[Cholestrl_(mg)] from NutritionData WHERE NDB_No = '" + id + "'";
    db.get(sqlStr, function (nutriErr, nutriRow) {
        if (nutriErr)
            console.error(nutriErr);

        console.log(nutriRow);
        res.render("details", {
            row: nutriRow,
            user: req.user
        });
    });
*/