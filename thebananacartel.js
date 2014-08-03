
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var engine = require('ejs-locals');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// routing
app.get('/', routes.index);
app.get('/a01', routes.a01);
app.get('/a02', routes.a02);
app.get('/a03', routes.a03);
app.get('/a04', routes.a04);
app.get('/a05', routes.a05);
app.get('/a06', routes.a06);
app.get('/a07', routes.a07);
app.get('/a08', routes.a08);
app.get('/a09', routes.a09);
app.get('/a10', routes.a10);
app.get('/a11', routes.a11);
app.get('/a12', routes.a12);
app.get('/about', routes.about);

// buy email
app.get('/buy', routes.buy);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
