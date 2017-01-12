var PORT = process.env.PORT || 3000;
var moment = require("moment");
var express = require("express");

var app = express();
// Node.js 自身就帶有一個叫做 http 的 module，可以呼叫 http.createServe 建立一個相當基本伺服器
// tell node to start a new server and to use the express app as the bolilerplate.
// so any thing that the express app listen to, should the server listen to
var http = require("http").Server(app);
// this is the format that socket io expected
// socket.io is just the way to make socket easier to use.
var io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));

var clientInfo = {};
// var clientInfo = {
//     "socket.id": {
//         name: "Andrew",
//         room: "LOTR Fans"
//     }
// };

// send current users to provided socket
function sendCurrentUsers (socket) {
    var info = clientInfo[socket.id];
    var users = [];

    if (typeof info === "undefined") {
        return;
    }

    // return all the attributes of the object
    Object.keys(clientInfo)
        .forEach(function (socketId) {
            var userInfo = clientInfo[socketId];

            if (info.room === userInfo.room) {
                users.push(userInfo.name);
            }
        });

    socket.emit("message", {
        name: "System",
        text: `Current users: ${users.join(", ")}`,
        timestamp: moment.valueOf()
    });
}

// on: listen for event
// on(eventName, callback when event happen)
// 在有新的client連入的時候，就會執行到connection的callback function，
// 會傳入一個socket，可以利用這個socket跟這個client溝通 (individual connection)
io.on("connection", function (socket) {
    console.log("User connected via socket.io!");

    socket.on("disconnect", function () {
        var userData = clientInfo[socket.id];
        if (typeof userData !== "undefined") {
            socket.leave(userData.room);
            io.to(userData.room).emit("message", {
                name: "System",
                text: `${userData.name} has left!`,
                timestamp: moment().valueOf()
            });
            delete clientInfo[socket.id];
        }
    });

    socket.on("joinRoom", function (req) {
        clientInfo[socket.id] = req;
        // socket.io可以使用分组方法,socket.join(),以及与之对应的socket.leave()。
        socket.join(req.room);
        // only people in this room can see the message
        // sending to all clients in 'req.room' room(channel) except sender
        socket.broadcast.to(req.room).emit("message", {
            name: "System",
            text: `${req.name} has joined!`,
            timestamp: moment().valueOf()
        });
    });

    socket.on("message", function (message) {
        console.log("Message received:" + message.text);

        if (message.text === "@currentUsers") {
            sendCurrentUsers(socket);
        } else {
            message.timestamp = moment().valueOf(); // return the javascript timestamp, milliseconds version of the regular unit timestamp 
            // sent the message to all of people except the person who sent the message
            // socket.broadcast.emit("message", message);
            // sent the message to all of people include the person who sent the message
            // io.emit("message", message);
            io.to(clientInfo[socket.id].room).emit("message", message);
        }
    });

    // emit an event: emit(event name, data to sent)
    // (sent the message to all of people include the person who sent the message)
    // sending to sender-client only
    socket.emit("message", {
        name: "System",
        text: "Welcome to the chat application!",
        timestamp: moment().valueOf()
    });
});

// start the server
http.listen(PORT, function () {
    console.log("Server started!");
});