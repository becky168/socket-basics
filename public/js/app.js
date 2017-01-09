var socket = io();

// 等待 connect 這個事件，也就是和 server 連上線後，就會觸發
socket.on("connect", function () {
    console.log("connected to socket.io server!");
});

socket.on("message", function (message) {
    // pass the data in (parameter:message => present data)
    console.log("New message");
    console.log(message.text);
});