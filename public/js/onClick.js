//var sqlite3 = require('sqlite3').verbose(); 
//var db = new sqlite3.Database('../../datasets/nutrition.db'); 

function Submitted() {
    var name = document.getElementById("name").value;
	var portion = document.getElementById("portion").value;
    var sql = "SELECT * from NutritionData WHERE  Shrt_Desc like '" + name + "%'";  
    console.log(sql);
}


/*
for the ejs addFood


<!-- working on form action -->
<form action="js/onClick.js" method="get">
    <input id="food" name="food" placeholder="Please enter food name" type="text">  
    <!-- <input id="portion" name="portion" placeholder="Portion sizes" type="text"> 
    add portion after a select button when the database populates
    <input onclick="Submitted()" type="button" value="Search">
    -->
    <a href = "javascript: Submitted()">Search</a>
</form> 
*/