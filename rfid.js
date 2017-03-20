var MFRC522 = function () {
};

MFRC522.prototype.spawn = require('child_process').spawn;
MFRC522.prototype.rc522py = null;
MFRC522.prototype.callback = null;
MFRC522.prototype.uidRegExp = new RegExp("^Card read UID: ([0-9,]+)");
MFRC522.prototype.sectorRegExp = new RegExp("^Sector 8 \\[(.*)\\]");

MFRC522.prototype.start = function (callback) {
    // callback
    this.callback = callback;

    // spawn python process to access on output
    this.rc522py = this.spawn('python', ['-u', __dirname + '/MFRC522-python/Dump.py']);

    var _this = this;
    this.rc522py.stdout.on('data', function (data) {
        // retrieved output from python process
        var lines = data.toString('utf8').split(/\r\n|\r|\n/);
        for (var i in lines) {
            var arr = _this.uidRegExp.exec(lines[i]);
            var sector = _this.sectorRegExp.exec(lines[i]);

            if ((sector != null) && (sector.length == 2)) {
                var string = '';
                var block = sector[1].split(',');
                for (var index in block) {
                    var dec = block[index];
                    string += String.fromCharCode(dec);
                }
                console.log(string);
            }

            if ((arr != null) && (arr.length == 2)) {
                // trigger callback function
                _this.callback.onUid(arr[1]);
            }
        }
    });

    this.rc522py.on('exit', function () {
        _this.callback.onExit();
    });

    _this.callback.onStart();
};

module.exports = new MFRC522();