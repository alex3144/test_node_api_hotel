var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var router = require('router');
var app = express();

///CONFIG BODY PARSER ////

var bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
		extended: true
}));

// app.set('views', __dirname + '/views');
// app.use(router);
// app.use(express.bodyParser());


fs.readdirSync('./controllers').forEach(function (file) {
  	if(file.substr(-3) == '.js') {
     	route = require('./controllers/' + file);
      	route.controller(app);
  	}
});


app.all('*',function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});

app.listen(3000, function () {
});
