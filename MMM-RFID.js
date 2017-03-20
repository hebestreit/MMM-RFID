Module.register("MMM-RFID", {
    requiresVersion: "2.1.0",

    // Default module config.
    defaults: {},

    // Define start sequence.
    start: function () {
        Log.info("Starting module: " + this.name);

        this.sendSocketNotification("RFID_CONFIG", {
            config: this.config
        });
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "BUTTON_UP") {
            this.buttonUp(payload.index, payload.duration);
            this.sendNotification("HIDE_ALERT");
        }
        if (notification === "BUTTON_DOWN") {
            this.buttonDown(payload.index);
        }
    },
});