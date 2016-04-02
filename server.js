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
var report = function(action, building, room) {
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