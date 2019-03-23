var config = require('./config'),
    express = require("./express"),
    path = require('path');


module.exports.start = function() {

    var app = express.init();

    let port = process.env.PORT;
if (port == null || port == "") {
  port = 8080;
}

    app.listen(port, function() {
        console.log('filmApp listening on port 8080 (if not being hosted)');
    });
};