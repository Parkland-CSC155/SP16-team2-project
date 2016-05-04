var express = require("express");
var router = express.Router();
var app = express();
const APIKEY = 'abcd'; // some unique value that attackers cannot guess
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./datasets/nutrition.db');

exports.index = function (req, res) {
    //res.send("hello World");
    res.render('default', {
        title: 'Home',
        user: req.user
    });
};

exports.home = function (req, res) {
    var sqlString = "";
    var pgNum = req.query.page || 1;
    console.log("page number is " + pgNum);
    var searchText = req.query.searchText;
    console.log(searchText);
    pgNum = Number(pgNum);
    var start = 25 * (pgNum - 1);
    if (searchText) {
        sqlString = "SELECT NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2 from NutritionData WHERE Shrt_Desc like '" + searchText +
            "%' order by Shrt_Desc limit 25 offset " + start;
    } else {
        sqlString = "SELECT NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2 from NutritionData order by Shrt_Desc limit 25 offset " + start;
    }
    db.all(sqlString, function (nutriErr, nutriRows) {
        if (nutriErr)
            console.error(nutriErr);

        res.render("index", {
            rows: nutriRows,
            page: pgNum,
            title: "Home",
            user: req.user
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

//for index.ejs prev  button
/* 
    <% if( page === 1) %>
      <a href="/home?page=1">Prev</a>
    <% else %>
    */