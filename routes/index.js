var express = require("express");
var router = express.Router();
var app = express();
//const APIKEY = 'abcd'; 
var sql = require('mssql');

exports.index = function (req, res) {
    //res.send("hello World");
     var connectionString = process.env.MS_TableConnectionString;

    sql.connect(connectionString).then(function () {
        res.render('default', {
            title: 'Home',
            user: req.user
        });
    });
};

exports.home = function (req, res, next) {
    var sqlString = "", len, dbTotLength = "";
    var pgPrev, PgOne, pgTwo, pgThree, pgFour, pgNext, pgFirst, pgLast;
    var pgNum = req.query.page || 1;
    console.log("page number is " + pgNum);
    var searchText = req.query.searchText;
    console.log("search text is " + searchText);
    pgNum = Number(pgNum);
    var skip = 25 * (pgNum - 1);

   // var connectionString = process.env.SQLCONNSTR_MS_TableConnectionString;
   var connectionString = "Server=tcp:sqlnutrition.database.windows.net,1433;Database=nutritiondb;Uid=dsinghania1@sqlnutrition;Pwd=iamsti11@park;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=3000;"

    sql.connect(connectionString).then(function () {
        if (searchText) {
            sqlString = `
                SELECT  NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2
                FROM    NutritionData
                WHERE   Shrt_Desc LIKE '${searchText}%'
                ORDER BY Shrt_Desc
                OFFSET  ${skip} ROWS
                FETCH NEXT 25 ROWS ONLY    
                    `;
            dbTotLength = `
                        SELECT count(*)
                        FROM   NutritionData
                        WHERE   Shrt_Desc LIKE '${searchText}%'
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
            console.log(record);
            new sql.Request().query(dbTotLength).then(function (recordset1) {
                console.dir(recordset1);
                var record1 = recordset1[0];
                console.log(record1);
                len = record1[''];
                console.log("recordset1 ['']" + len);
                len = Number(len);
                console.log("len after number(len is " + len);
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
                    pgLast = numPages;
                    pgOne = pgNum;

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
                    rows: recordset,
                    page: pgNum,
                    title: "Home",
                    user: req.user,
                    length: numPages,
                    text: searchText,
                    pageFirst: pgFirst,
                    pagePrev: pgPrev,
                    curpg: pgOne,
                    pageTwo: pgTwo,
                    pageThree: pgThree,
                    pageFour: pgFour,
                    pageNext: pgNext,
                    pageLast: pgLast
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
    //var connectionString = process.env.SQLCONNSTR_MS_TableConnectionString;
    var connectionString = "Server=tcp:sqlnutrition.database.windows.net,1433;Database=nutritiondb;Uid=dsinghania1@sqlnutrition;Pwd=iamsti11@park;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=3000;"


    sql.connect(connectionString).then(function () {
        sqlStr = `
                SELECT  NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2, [Water_(g)], [Energ_Kcal], [Protein_(g)], [Carbohydrt_(g)], [Fiber_TD_(g)], [Sugar_Tot_(g)], [FA_Sat_(g)], [Cholestrl_(mg)]
                FROM  NutritionData
                WHERE NDB_No = '${id}';
                    `;
        return new sql.Request().query(sqlStr).then(function (recordset2) {
            console.dir(recordset2);
            var record2 = recordset2[0];
            console.log(record2);

            res.render('details', {
                row: record2,
                user: req.user
            });
        });
    })
    .catch(function (err) {
        console.log(err);
        next(err);
    });
};