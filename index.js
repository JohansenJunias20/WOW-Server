const ws = require('ws');
const express = require('express');
const https = require('https');

var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

// your express configuration here

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(8443);