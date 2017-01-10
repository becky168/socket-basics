var moment = require("moment");
var now = moment();

console.log(now.format());
// now.subtract(1, "year");
// console.log(now.format());
// console.log(now.format("h:mma")); // 6:45pm
// console.log(now.format("MMM Do YYYY, h:mm a")); // Oct 5th 2015, 6:45 pm

// http://www.epochconverter.com/
console.log(now.format("X")); // second
console.log(now.format("x")); // millisecond
console.log(now.valueOf()); // 相當於 now.format("x"), 只是 valueOf 是 number, format 是 string

var timestamp = 1444247486704;
var timestampMoment = moment.utc(timestamp); // utc time
// console.log(timestampMoment.format());
console.log(timestampMoment.local().format("h:mm a")); // 11:06 am // local time