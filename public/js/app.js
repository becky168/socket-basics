var name = getQueryVariable("name") || "Anonymous";
var room = getQueryVariable("room");
var socket = io();

console.log(`${name} wants to join ${room}`);

// Update h1 tag
$(".room-title").text(room);

// 等待 connect 這個事件，也就是和 server 連上線後，就會觸發
socket.on("connect", function () {
    console.log("connected to socket.io server!");

    socket.emit("joinRoom", {
        name: name,
        room: room
    });
});

socket.on("message", function (message) {
    // pass the data in (parameter:message => present data)

    var momentTimestamp = moment.utc(message.timestamp);
    var $messages = $(".messages");
    var $message = $("<li class='list-group-item'></li>");

    console.log("New message");
    console.log(message.text);

    $message.append(`<p><strong>${message.name} ${momentTimestamp.local().format("h:mm a")}</strong></p>`);
    $message.append(`<p>${message.text}</p>`);
    $messages.append($message);
    // $message.append("<p><strong>" + momentTimestamp.local().format("h:mm a") + "</strong>: " + message.text + "</p>");
});

// Handles submitting of new message
var $form = $("form");

$form.on("submit", function (event) {
    event.preventDefault(); // not refresh page

    var $message = $form.find("input[name=message]");

    socket.emit("message", {
        name: name,
        text: $message.val()
    });

    $message.val("");
});