Module.register("MMM-RFID", {
    requiresVersion: "2.1.0",

    // Default module config.
    defaults: {
        // events should be dispatched when tag has been scanned
        events: {}
    },

    /**
     * Define start sequence.
     */
    start: function () {
        Log.info("Starting module: " + this.name);

        this.sendSocketNotification("RFID_CONFIG", {
            config: this.config
        });
    },

    /**
     * Received socket notification and dispatch notification to other modules
     * @param notification
     * @param payload
     */
    socketNotificationReceived: function (notification, payload) {
        if (notification === "RFID_UID") {
            this.sendNotification("RFID_UID", payload);
        }

        if (notification === "RFID_DATA") {
            this.sendNotification("RFID_DATA", payload);
            this.dispatchEvents(payload.data)
        }
    },

    /**
     * Dispatch configured events
     * @param {string} data
     */
    dispatchEvents: function (data) {
        var events = this.config.events[data];

        for (var index in events) {
            if (!events.hasOwnProperty(index)) {
                return;
            }
            var event = events[index];
            var notification = Object.keys(event)[0];
            var payload = event[notification];
            this.sendNotification(notification, payload);
        }
    }
});