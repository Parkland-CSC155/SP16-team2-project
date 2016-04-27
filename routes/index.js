var express = require("express");
var router = express.Router();
var app = express();          
const APIKEY = 'abcd'; // some unique value that attackers cannot guess
var sqlite3 = require('sqlite3').verbose();  
var db = new sqlite3.Database('./datasets/nutrition.db'); 

exports.index = function(req, res) {
//  res.send("hello World");
  
  res.render('default', {
    title: 'Home'
  });
  //var login = $("#myBtn");
  var login = document.getElementById("#myBtn");
  login.click(function(){
        $("#myModal").modal();
  });
};

exports.login = function(req, res){
    res.send("login page");    
};

exports.calculator = function(req, res){
    res.render('calc', {
       title: 'Calculator Page',
       search: 'Search the database for food'
    });
};