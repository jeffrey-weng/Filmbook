var config = require('./config'),
    express = require("./express"),
    path = require('path');


module.exports.start = function() {

    var app = express.init();

    app.listen(config.port, function() {
        console.log('filmApp listening on port 3456 (if not being hosted)');
    });
};