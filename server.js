var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');

var port = process.env.NODE_PORT || 20202;
var responses = require('./server/responses');

app.use(express.static('dist'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/query', function(req, res, next) {
    res.header("Content-Type", "application/json").status(200).send(req.query);
});

app.get('*', function(req, res, next) {
    var path = req.path;
    var response = responses.get[path];
    if (response) {
        if (typeof response !== 'string') {
            res.header("Content-Type", "application/json");

        }
        res.status(200).send(response);
    } else {
        res.sendStatus(404);
    }
});

app.post('*', function (req, res, next) {
	res.status(200).send({
		num: req.body.num * 13
	});
});

http.createServer(app).listen(port, function() {
    console.log('Test server running on port ' + port);
});
