var exports = {};

exports.startListeners = function() {
    require('./chat').init();
    require('./group-chat').init();
}

module.exports = exports;
