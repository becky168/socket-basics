var socket = io();

// 等待 connect 這個事件，也就是和 server 連上線後，就會觸發
socket.on("connect", function () {
    console.log("connected to socket.io server!");
});

socket.on("message", function (message) {
    // pass the data in (parameter:message => present data)

    var momentTimestamp = moment.utc(message.timestamp);

    console.log("New message");
    console.log(message.text);

    $(".messages").append("<p><strong>" + momentTimestamp.local().format("h:mm a") + "</strong>: " + message.text + "</p>");
});

// Handles submitting of new message
var $form = $("form");

$form.on("submit", function (event) {
    event.preventDefault(); // not refresh page

    var $message = $form.find("input[name=message]");

    socket.emit("message", {
        text: $message.val()
    });

    $message.val("");
});