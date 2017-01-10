var PORT = process.env.PORT || 3000;
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

// on: listen for event
// on(eventName, callback when event happen)
// 在有新的client連入的時候，就會執行到connection的callback function，
// 會傳入一個socket，可以利用這個socket跟這個client溝通 (individual connection)
io.on("connection", function (socket) {
    console.log("User connected via socket.io!");

    socket.on("message", function (message) {
        console.log("Message received:" + message.text);

        // sent the message to all of people except the person who sent the message
        // socket.broadcast.emit("message", message);
        // sent the message to all of people include the person who sent the message
        io.emit("message", message);
    });

    // emit an event: emit(event name, data to sent)
    // (sent the message to all of people include the person who sent the message)
    // sending to sender-client only
    socket.emit("message", {
        text: "Welcome to the chat application!"
    });
});

// start the server
http.listen(PORT, function () {
    console.log("Server started!");
});