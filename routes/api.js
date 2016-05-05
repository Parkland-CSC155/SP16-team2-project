var express = require("express");
var router = express.Router();
var app = express();
const APIKEY = 'abcd'; 
var mssql = require('mssql');
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