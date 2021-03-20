const WebSocket = require('ws');
const validator = require('validator');
var fs = require('fs');
var https = require('https');
var privateKey = fs.readFileSync('/etc/letsencrypt/live/rust-sby.xyz/privkey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/rust-sby.xyz/cert.pem', 'utf8');

var credentials = { key: privateKey, cert: certificate };
var express = require('express');
var bodyParser = require('body-parser')
var app = express();

// your express configuration here

var httpsServer = https.createServer(credentials, app);

const wss = new WebSocket.Server({ server: httpsServer });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('something');
});

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// HTTPS LISTENER
// *-----------------------------------------------------*
app.post("/authorization", (req, res) => {
    console.log(req.body);
    const message = req.body;
    const username = message.username;
    const password = message.password;
    res.send("Hello");
})
app.get("/", (req, res) => {
    res.send("Hello");
})
// WSS LISTENER
// *-----------------------------------------------------*
httpsServer.listen(8443);