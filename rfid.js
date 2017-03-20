var MFRC522 = function () {
};

MFRC522.prototype.spawn = require('child_process').spawn;
MFRC522.prototype.rc522py = null;
MFRC522.prototype.callback = null;
MFRC522.prototype.uidRegExp = new RegExp("^UID: ([0-9,]+)");
MFRC522.prototype.dataBlock8 = new RegExp("^Data Block 8: \\[(.*)\\]");

MFRC522.prototype.start = function (callback) {
    // callback
    this.callback = callback;

    // spawn python process to access on output
    this.rc522py = this.spawn('python', ['-u', __dirname + '/MFRC522-python/Dump.py']);

    var self = this;
    this.rc522py.stdout.on('data', function (data) {
        // retrieved output from python process
        var lines = data.toString('utf8').split(/\r\n|\r|\n/);
        for (var line in lines) {
            var uid = self.uidRegExp.exec(lines[line]);
            var dataBlock8 = self.dataBlock8.exec(lines[line]);

            if (dataBlock8 && dataBlock8.length === 2) {
                self.callback.onData(dataBlock8[1]);
            }

            if ((uid !== null) && (uid.length === 2)) {
                self.callback.onUid(uid[1]);
            }
        }
    });

    this.rc522py.on('exit', function () {
        self.callback.onExit();
    });

    self.callback.onStart();
};

module.exports = new MFRC522();