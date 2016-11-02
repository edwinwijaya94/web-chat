var exports = {};

exports.startListeners = function() {
	console.log("START");
    require('./chat').init();
    // require('./group-chat').init();
}

module.exports = exports;
