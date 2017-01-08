var PORT = process.env.PORT || 3000;
var express = require("express");

var app = express();
// Node.js 自身就帶有一個叫做 http 的 module，可以呼叫 http.createServe 建立一個相當基本伺服器
// tell node to start a new server and to use the express app as the bolilerplate.
// so any thing that the express app listen to, should the server listen to
var http = require("http").Server(app);

app.use(express.static(__dirname + "/public"));

// start the server
http.listen(PORT, function () {
    console.log("Server started!");
});