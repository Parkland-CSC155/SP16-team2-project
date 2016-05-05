var express = require("express");
var router = express.Router();
var app = express();
const APIKEY = 'abcd';
var sql = require('mssql');
var sqlHelper = require('../lib/sql-helper');

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
router.get("/search/:text", function (req, res, next) {

    var sqlString = "";
    var searchText = req.params.text;
    console.log("search text is " + searchText);
    var pgNum = req.query.page || 1;
    console.log("page num is " + pgNum);
    pgNum = Number(pgNum);
    var skip = 25 * (pgNum - 1);

    // do the query 
    if (searchText) {
        sqlString = `
                SELECT  NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2
                FROM    NutritionData
                WHERE   Shrt_Desc LIKE '${searchText}%'
                ORDER BY Shrt_Desc
                OFFSET  ${skip} ROWS
                FETCH NEXT 25 ROWS ONLY    
                    `;
    } else {
        sqlString = `
                SELECT  NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2
                FROM    NutritionData
                ORDER BY Shrt_Desc
                OFFSET  ${skip} ROWS
                FETCH NEXT 25 ROWS ONLY    
                    `;
    }
    sqlHelper.query(sqlString)
        .then(function (records) {

            // send back JSON
            res.json(records);
        })
        .catch(function (err) {
            console.error(err);
            next(err);
        });
});

//- `/api/list?page={pageNumber}&apiKey={apiKey}`
router.get("/list", function (req, res, next) {
    var pgNum = req.query.page || 1;
    var skip = 25 * (pgNum - 1);
    var sqlString = `
                SELECT  NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2
                FROM    NutritionData
                ORDER BY Shrt_Desc
                OFFSET  ${skip} ROWS
                FETCH NEXT 25 ROWS ONLY    
                    `;

    sqlHelper.query(sqlString)
        .then(function (records) {

            // send back JSON
            res.json(records);
        })
        .catch(function (err) {
            console.error(err);
            next(err);
        });
});

//- `/api/{id}&apiKey={apiKey}` 
router.get("/details/:id", function (req, res, next) {
    var id = req.params.id;
    console.log("id is " + id);
    var sqlString = `
            SELECT  NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2, [Water_(g)], [Energ_Kcal], [Protein_(g)], [Carbohydrt_(g)], [Fiber_TD_(g)], [Sugar_Tot_(g)], [FA_Sat_(g)], [Cholestrl_(mg)]
            FROM  NutritionData
            WHERE NDB_No = '${id}';
                `;
    sqlHelper.query(sqlString)
        .then(function (records) {

            // send back JSON
            res.json(records);
        })
        .catch(function (err) {
            console.error(err);
            next(err);
        });
});
module.exports = router;