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
    var pgNum = req.query.page || 1;
    pgNum = Number(pgNum);
    /*
    $(".move").on("click", "button",function(e){
        console.log(e.target);
        console.log(this);
        if (pgNum !== 1) {
        pgNum -= 1;
    } else
        alert("You are on the first page");
    });
    
    ("next").click(function(){
        pgNum -= 1;
    });*/
    showData(pgNum, req, res);
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

function prev() {
    console.log("inside prev");
    var pgNum = req.query.page;
    pgNum = Number(pgNum);
    if (pgNum !== 1) {
        pgNum -= 1;
        showData(pgNum);
    } else
        alert("You are on the first page");
};

function next() {
    console.log("inside next");
    var pgNum = req.query.page;
    pgNum = Number(pgNum);
    pgNum += 1;
    showData(pgNum, req, res);
};

function showData(pgNum, req, res){
    var start = 25 * (pgNum - 1);
    var sqlString = "SELECT NDB_No, Shrt_Desc, GmWt_Desc1, GmWt_Desc2 from NutritionData order by Shrt_Desc limit 25 offset " + start;
    db.all(sqlString, function (nutriErr, nutriRows) {
        if (nutriErr)
            console.error(nutriErr);

        res.render("index", {
            rows: nutriRows
        });
    });
}