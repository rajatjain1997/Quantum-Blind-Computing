const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("../"));
app.use('/',express.static("../views"));
app.engine('.html', require('ejs').__express);
app.set('views',  path.resolve("../html"));
app.set('view engine', 'html');

app.get('/', function(req, res){
    res.render('index', {});
  });

io.on('connection', function(socket) {
    console.log("Connection recieved");
});

http.listen(8000, function(){
    console.log('listening on *:8000');
  });