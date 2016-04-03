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
			connection.query("SELECT * FROM `demands` WHERE (`building`='" + building + "' AND `room`='" + room + "' AND `demand` ='black');", function(err, rows){
				if (err) {
					console.dir(err);
					return;
				}
				if (rows.length == 0) {
					connection.query("INSERT INTO `demands` VALUES (0, '" + building + "', " + room + ", 'black');");
					return;
				}
			});
			break;
		case "needBlue":
			connection.query("SELECT * FROM `demands` WHERE (`building`='" + building + "' AND `room`='" + room + "' AND `demand` ='blue');", function(err, rows){
				if (err) {
					console.dir(err);
					return;
				}
				if (rows.length == 0) {
					connection.query("INSERT INTO `demands` VALUES (0, '" + building + "', " + room + ", 'blue');");
					return;
				}
			});
			break;
		case "needRed":
			connection.query("SELECT * FROM `demands` WHERE (`building`='" + building + "' AND `room`='" + room + "' AND `demand` ='red');", function(err, rows){
				if (err) {
					console.dir(err);
					return;
				}
				if (rows.length == 0) {
					connection.query("INSERT INTO `demands` VALUES (0, '" + building + "', " + room + ", 'red');");
					return;
				}
			});
			break;
		case "needGreen":
			connection.query("SELECT * FROM `demands` WHERE (`building`='" + building + "' AND `room`='" + room + "' AND `demand` ='green');", function(err, rows){
				if (err) {
					console.dir(err);
					return;
				}
				if (rows.length == 0) {
					connection.query("INSERT INTO `demands` VALUES (0, '" + building + "', " + room + ", 'green');");
					return;
				}
			});
			break;
		case "needEraser":
			connection.query("SELECT * FROM `demands` WHERE (`building`='" + building + "' AND `room`='" + room + "' AND `demand` ='eraser');", function(err, rows){
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
			connection.query("DELETE FROM `demands` WHERE `building`='" + building + "' AND `room`='" + room + "' AND `demand` ='black' ;", function(err, rows){});
			break;
		case "haveBlue":
			connection.query("DELETE FROM `demands` WHERE `building`='" + building + "' AND `room`='" + room + "' AND `demand` ='blue' ;", function(err, rows){});
			break;
		case "haveRed":
			connection.query("DELETE FROM `demands` WHERE `building`='" + building + "' AND `room`='" + room + "' AND `demand` ='red' ;", function(err, rows){});
			break;
		case "haveGreen":
			connection.query("DELETE FROM `demands` WHERE `building`='" + building + "' AND `room`='" + room + "' AND `demand` ='green' ;", function(err, rows){});
			break;
		case "haveEraser":
			connection.query("DELETE FROM `demands` WHERE `building`='" + building + "' AND `room`='" + room + "' AND `demand` ='eraser' ;", function(err, rows){});
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
		case "/list":
			connection.query("SELECT * FROM `demands`;", function(err, rows){
				if (err) {
					res.end();
					console.log(err);
					return;
				}
				var result = '<!doctype html><html><head><title>Markers Needed</title><meta name="viewport" content="width=device-width, initial-scale=1"> <link rel="stylesheet" href="../css/bootstrap.min.css"><style>body {max-width: 600px;margin-left: auto;margin-right: auto;}</style></head><body><nav class="navbar navbar-default"> <div class="container-fluid"> <div class="navbar-header"> <a href="/"> < Back </a> </div> </div> </nav><table class="table"><thead class="thead-inverse"><tr><th>ID</th><th>Building</th><th>Room</th><th>Demand</th></tr></thead><tbody>';
				for (var index = 0; index < rows.length; index++) {
					result = result + '<tr><td>' + rows[index].id + '</td> <td>' + rows[index].building + '</td> <td>' + rows[index].room + '</td> <td>' + rows[index].demand + '</td> </tr>';
				}
				result = result + '</tbody></table></body></html>';
				res.write(result);
				res.end();
			});
			break;
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
						case "none":
						default:
							break;
					}
				} if ((params.need == "none") || (params.need == null)) {
					if (params.have != null) {
						switch(params.have) {
							case "black":
								params.action = "haveBlack";
								break;
							case "green":
								params.action = "haveGreen";
								break;
							case "red":
								params.action = "haveRed";
								break;
							case "blue":
								params.action = "haveBlue";
								break;
							case "eraser":
								params.action = "haveEraser";
								break;
							case "none":
							default:
								break;
						}
					}
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
			var securePage = page;/*
			while (securePage.indexOf(".." >- 1)){
				securePage = securePage.replace("..",'.');
			}
			while (securePage.indexOf("./" >- 1)){
				securePage = securePage.replace("./",'');
			}
			
			switch(securePage) {
				case "/server.js":
				case "/.gitignore":
				case "/cert.pem":
				case "/csr.pem":
				case "/DBGS.sql":
				case "/private.pem":					
					res.end();
					return;
				default:
					break;
			}*/
			res.write(fs.readFileSync("./" + securePage));
			res.end();
			break;
	}
}).listen(4000);