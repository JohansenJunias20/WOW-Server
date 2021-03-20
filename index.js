const WebSocket = require('ws');
const validator = require('validator');
var mysql = require('mysql');
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
app.post("/authorization", (req, resHttp) => {
    console.log(req.body);
    const message = req.body;
    const username = message.username;
    const password = message.password;

    var response = {
        status: "unknown",
        reason: undefined,
        data: {
            WOW: undefined,
            LED: undefined

        }
    }
    connection.query("SELECT * FROM users where username = ? and password = ?", [username, password],
        (err, res) => {
            if (err)
                throw err;
            if (res.length != 0) {
                //ada
                response.status = "success";
                response.data.WOW = res[0]["WOW"];
                response.data.LED = res[0]["LED"];
                resHttp.send(response);
            }
            else{
                response.status = "failed";
                response.reason = "no username or password";
                resHttp.send(response);
            }
        })
})
app.get("/", (req, res) => {
    res.send("Hello");
})
// WSS LISTENER
// *-----------------------------------------------------*
httpsServer.listen(8443);



var dbConfig = {
    host: 'localhost',
    user: 'junias20',
    password: 'Jjdvih0506',
    database: 'WOW',
    port: "3306"
};

var connection;
function handleDisconnect() {
    connection = mysql.createConnection(dbConfig);  // Recreate the connection, since the old one cannot be reused.
    connection.connect(function onConnect(err) {   // The server is either down
        if (err) {                                  // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 10000);    // We introduce a delay before attempting to reconnect,
        }                                           // to avoid a hot loop, and to allow our node script to
    });                                             // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function onError(err) {
        console.log('db error', err);
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {   // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                        // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}
handleDisconnect();