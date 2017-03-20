var mfrc522 = require("rfid.js");

var NodeHelper = require("node_helper");
module.exports = NodeHelper.create({
    // Subclass start method.
    start: function () {
        var self = this;

        console.log("Starting node helper for: " + self.name);

        this.loaded = false;
    },
    // Subclass socketNotificationReceived received.
    socketNotificationReceived: function (notification, payload) {
        if (notification === 'RFID_CONFIG') {
            this.config = payload.config;

            this.initializeRfid();
        }
    },
    initializeRfid: function () {
        var Callback = function () {
            this.onStart = function () {
                console.log('onStart');
            };

            this.onUid = function (uid) {
                console.log('onUid');
                console.log(uid);
            };

            this.onExit = function () {
                console.log('onExit');
            };
        };
        mfrc522.start(new Callback());
    }
});