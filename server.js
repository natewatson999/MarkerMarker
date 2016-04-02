var https = require("https");
var mysql = require("mysql");
var url = require("url");
var fs = require('fs');
var config = {
   key: fs.readFileSync('private.pem'),
   cert: fs.readFileSync('csr.pem')
};
var MainPageContent = fs.readFileSync("./client.html");
var ReceivedPageContent = fs.readFileSync("./received.html");
var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "@m@21n66r@c3H0993r",
	database: "MarkerMarker"
});
connection.connect();
var report = function(action, building, room) {
	switch (){
		case "needBlack":
			break;
		case "needBlue":
			break;
		case "needRed":
			break;
		case "needGreen":
			break;
		case "needEraser":
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
	if (req.url.indexof("?") > -1) {
		page = req.url.substring(0, req.url.indexof("?")); 
	} else {
		page = req.url;
	}
	switch (page){
		case "report":
			var params = url.parse(req.url, true);
			if ((params.action != null) &&params.building != null) && (params.room != null)) {
				report(params.action, params, building, params.room);
			}
			res.write(ReceivedPageContent);
			res.end();
			break;
		case "favicon.ico":
			res.end();
			break;
		default:
			res.write(req.url);
			res.end();
			break;
	}
}).listen(4000);