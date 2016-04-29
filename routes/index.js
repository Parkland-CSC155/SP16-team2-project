var express = require("express");
var router = express.Router();
var app = express();          
const APIKEY = 'abcd'; // some unique value that attackers cannot guess
var sqlite3 = require('sqlite3').verbose();  
var db = new sqlite3.Database('./datasets/nutrition.db'); 

exports.index = function(req, res) {
//  res.send("hello World");
  
  res.render('default', {
    title: 'Home',
    user: req.user 
  });
  /*var login = $("#myBtn");
  var login = document.getElementById("#myBtn");
  login.click(function(){
        $("#myModal").modal();
  });*/
};

exports.home = function(req, res){
    res.render("index", {});    
};

exports.calculator = function(req, res){
    res.render('calc', {
       title: 'Calculator Page'
    });
};

exports.add = function(req, res){
    res.render('addFood', {
       title: 'Adding Ingredients',
       search: 'Search the database for food'
    });
};

