var https = require("https");
var mysql = require("mysql");
var url = require("url");
var fs = require('fs');
var config = {
   key: fs.readFileSync('private.pem'),
   cert: fs.readFileSync('csr.pem')
};
var MainPageContent = fs.readFileSync("./index.html");
var ReceivedPageContent = fs.readFileSync("./received.html");
var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "@m@21n66r@c3H0993r",
	database: "MarkerMarker"
});
connection.connect();
var report = function(action, building, room) {
	switch (action){
		case "needBlack":
			connection.query("SELECT * FROM `demands` WHERE (`building`='" + building + "' & `room`='" + room + "' & 'demand' ='black');", function(err, rows){
				if (err) {
					console.dir(err);
					return;
				}
				if (rows.length == 0) {
					connection.query("INSERT INTO `demands` VALUES (0, '" + building + "', " + room + ", 'eraser');");
					return;
				}
			});
			break;
		case "needBlue":
			connection.query("SELECT * FROM `demands` WHERE (`building`='" + building + "' & `room`='" + room + "' & 'demand' ='blue');", function(err, rows){
				if (err) {
					console.dir(err);
					return;
				}
				if (rows.length == 0) {
					connection.query("INSERT INTO `demands` VALUES (0, '" + building + "', " + room + ", 'eraser');");
					return;
				}
			});
			break;
		case "needRed":
			connection.query("SELECT * FROM `demands` WHERE (`building`='" + building + "' & `room`='" + room + "' & 'demand' ='red');", function(err, rows){
				if (err) {
					console.dir(err);
					return;
				}
				if (rows.length == 0) {
					connection.query("INSERT INTO `demands` VALUES (0, '" + building + "', " + room + ", 'eraser');");
					return;
				}
			});
			break;
		case "needGreen":
			connection.query("SELECT * FROM `demands` WHERE (`building`='" + building + "' & `room`='" + room + "' & 'demand' ='green');", function(err, rows){
				if (err) {
					console.dir(err);
					return;
				}
				if (rows.length == 0) {
					connection.query("INSERT INTO `demands` VALUES (0, '" + building + "', " + room + ", 'eraser');");
					return;
				}
			});
			break;
		case "needEraser":
			connection.query("SELECT * FROM `demands` WHERE (`building`='" + building + "' & `room`='" + room + "' & 'demand' ='eraser');", function(err, rows){
				if (err) {
					console.dir(err);
					return;
				}
				if (rows.length == 0) {
					connection.query("INSERT INTO `demands` VALUES (0, '" + building + "', " + room + ", 'eraser');");
					return;
				}
			});
			break;
		case "haveBlack":
			connection.query("DELETE FROM `demands` WHERE (`building`='" + building + "' & `room`='" + room + "' & 'demand' ='black');", function(err, rows){
			});
			break;
		case "haveBlue":
			connection.query("DELETE FROM `demands` WHERE (`building`='" + building + "' & `room`='" + room + "' & 'demand' ='blue');", function(err, rows){
			});
			break;
		case "haveRed":
			connection.query("DELETE FROM `demands` WHERE (`building`='" + building + "' & `room`='" + room + "' & 'demand' ='red');", function(err, rows){
			});
			break;
		case "haveGreen":
			connection.query("DELETE FROM `demands` WHERE (`building`='" + building + "' & `room`='" + room + "' & 'demand' ='green');", function(err, rows){
			});
			break;
		case "haveEraser":
			connection.query("DELETE FROM `demands` WHERE (`building`='" + building + "' & `room`='" + room + "' & 'demand' ='eraser');", function(err, rows){
			});
			break;
		default:
			break;
	}
	return;
};
var server = https.createServer(config, function (req, res) {
	var path = req.url;
	if (path == "/" || path =="/index.html" || path=="/client.html") {
		res.write(MainPageContent);
		res.end();
		return;
	}
	var page = "";
	if (req.url.indexOf("?") > -1) {
		page = req.url.substring(0, req.url.indexOf("?")); 
	} else {
		page = req.url;
	}
	switch (page){
		case "/report":
			var params = (url.parse(req.url, true)).query;
			if ( params.action == null) {
				if (params.need != null) {
					switch(params.need) {
						case "black":
							params.action = "needBlack";
							break;
						case "green":
							params.action = "needGreen";
							break;
						case "red":
							params.action = "needRed";
							break;
						case "blue":
							params.action = "needBlue";
							break;
						case "eraser":
							params.action = "needEraser";
							break;
					}
				} else {
				}
			}
			console.dir(params);
			if ((params.action != null) && (params.building != null) && (params.room != null)) {
				console.log("reached");
				report(params.action, params.building, params.room);
			}
			res.write(ReceivedPageContent);
			res.end();
			break;
		default:
			res.write(fs.readFileSync("./" + page));
			res.end();
			break;
	}
}).listen(4000);