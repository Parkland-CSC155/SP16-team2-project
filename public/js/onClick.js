var sqlite3 = require('sqlite3').verbose(); 
var db = new sqlite3.Database('../../datasets/nutrition.db'); 

function Submitted() {
    var name = document.getElementById("name").value;
	var portion = document.getElementById("portion").value;
    var sql = "SELECT * from NutritionData WHERE  Shrt_Desc like '" + name +"%'";  
    console.log(sql);
}