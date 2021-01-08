const express = require('express');
const app = express();
const PORT = 1337;
const bodyParser = require('body-parser');
const user = require('./routes/user.route');
const contact = require('./routes/contact.route');
const group = require('./routes/group.route');
const event = require('./routes/event.route');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

//const http = require('http').Server(app)
/*
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);
*/
const server = require('http').createServer(app);
const io = require('socket.io')(server);


//const io = require('socket.io');

//const socket = io(http);

mongoose.connect('mongodb://localhost:27017/Buddygram', { useNewUrlParser: true });


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/user', user);

app.use('/contact', contact);
app.use('/event', event);
app.use('/eventImages', group);
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/*
io.on('connection', client => {
    console.log('a user connected');

  //  client.emit('connected', "connected");
    client.on('chassage', data => {
    
        console.log('Hello WOrld');
    });
    client.on('chatmessage', data => {
        
        console.log('Hello WOrld');
    });

 //   client.emit('chatmessage', "hyy");
    client.on('chatmessage', function () {
        console.log('Received');
    });

    
    client.on('disconnect', () => {
       
});
});
/*
io.on('connection', function (sock) {
    console.log('a user connected');
   /* console.log("message: " + socket._events);
    socket.on('chatmessage', function (data) {
        console.log('Hello WOrld');
    });*/
    //socket.event()
    //sock.emit("chatmessage", "connected");
io.on("chatmessage", name => {
    console.log('Received');
    socket.emit("chatmessage", `hi ${name}, You are connected to the server`);
});

 /*
    sock.on('chatmessage', name => {
        console.log('Hello WOrld');
      //  socket.emit("chatmessage", `hi ${name}, You are connected to the server`);
    });

  sock.on('chatmessage', function (msg) {
        console.log("message: " + msg);
        //broadcast message to everyone in port:5000 except yourself.
        socket.broadcast.emit("received", { message: msg });
    });

  
   
    sock.on('disconnect', function () {
        console.log('user disconnected');
    });
});
*/



/*
try {
    var userId = "3";
    var temp = "2";
    var members = [];
    for (var i=0; i <1; i++) {
        var tempMember = {
            userId: "2",
            status: 'pending'
        };
        members.push(tempMember);
    }
    var event = new Event({
        user_id: userId,
        type: 1,
        title: "bday party",
        venue: "hall",
        dateTime: req.body.dateTime,
        members: members
    });
    event.save().then(function (result) {
        console.log(result);
        res.status(200).json({
            success: true,
            message: 'New event has been created'
        });
    }).catch(error => {
        res.status(500).json({
            success: false,
            message: error
        });
    });
}
catch (err) {
    res.status(500).json({
        success: false,
        message: err
    });
}
*/
app.use(function (req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['authorization'] || req.headers['x-access-token'];
    // decode token
    if (token) {

        var ind = token.indexOf('Bearer ');
        if (ind !== -1)
            token = token.substring(7);
        // verifies secret and checks exp
        //console.log(app.get('secret'));
        jwt.verify(token, 'secret', function (err, decoded) {
            if (err) {
                console.log(err);
                return res.status(401).json(
                    {
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                console.log(req.decoded);
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});



app.use('/group', group);


server.listen(PORT, function () {
    console.log('Server is running on Port', PORT);
});


