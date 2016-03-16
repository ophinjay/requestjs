var express = require('express');
var app = express();
var http = require('http');
var path = require('path');

var port = process.env.NODE_PORT || 20202;
var responses = require('./server/responses');

app.use(express.static('dist'));
app.get('/', function (req, res, next) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('*', function (req, res, next) {
	var getResponses = responses.get;
	var path = req.path;
	if(getResponses[path]) {
		res.type('application/json').status(200).send(getResponses[path]);
	} else {
		res.sendStatus(404);
	}
});

http.createServer(app).listen(port, function(){
  console.log('Test server running on port ' + port);
});
