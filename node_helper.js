var mfrc522 = require("./rfid.js");

var NodeHelper = require("node_helper");
module.exports = NodeHelper.create({
    /**
     * Method called when module has been started
     */
    start: function () {
        var self = this;

        console.log("Starting node helper for: " + self.name);

        this.loaded = false;
    },
    /**
     * Received socket notification
     * @param notification
     * @param payload
     */
    socketNotificationReceived: function (notification, payload) {
        if (notification === 'RFID_CONFIG') {
            this.config = payload.config;

            this.initializeRfid();
        }
    },
    /**
     * Initialize rfid module and send socket notification
     */
    initializeRfid: function () {
        var self = this;
        var Callback = function () {
            this.onStart = function () {
            };

            this.onUid = function (uid) {
                self.sendSocketNotification('RFID_UID', uid);
            };

            this.onData = function (data) {
                var string = '';
                var buf = data.split(',');
                for (var i in buf) {
                    var dec = buf[i].trim();
                    if (dec !== '0') {
                        string += String.fromCharCode(parseInt(dec));
                    }
                }

                self.sendSocketNotification('RFID_DATA', {data: string});
            };

            this.onExit = function () {
            };
        };
        mfrc522.start(new Callback());
    }
});