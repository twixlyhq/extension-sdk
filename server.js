// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var compression = require('compression');

// set our port 
app.set('port', (process.env.PORT || 13000));  

app.use(bodyParser({limit: '1mb'}));

// compress responses
// app.use(compression());

var cacheFor = -1;
// if(process.env.NODE_ENV) {
//   cacheFor = 86400000; // one day
// }

app.use('/', express.static( path.join( __dirname, '' ), { maxAge: cacheFor }));

// start the server
app.listen(app.get('port'), function() { 
  console.log('Node app is running on port', app.get('port'));
});