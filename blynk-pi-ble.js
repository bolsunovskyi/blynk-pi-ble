var BlynkLib = require('blynk-library');
var blePeripheral = require('./pi-ble');

BlynkLib.Blynk.prototype.connect = function() {
    var self = this;

    if(self.conn) {
        self.conn.removeAllListeners();
    }
    self.conn.connect(function() {
        self.conn.on('data', function(data) { self.onReceive(data);     });
        self.conn.on('end',  function()     { self.end();               });
    });
    self.conn.on('error', function(err) { self.error(err);            });
    self.timerHb = true;
};

var blynk = new BlynkLib.Blynk('--YOUR TOKEN HERE--', options = {
    connector: new blePeripheral.BLEPeripheral({advertiseName: "Blynk-Raspi"})
});

var v1 = new blynk.VirtualPin(1);
var v9 = new blynk.VirtualPin(9);

v1.on('write', function(param) {
    console.log('V1:', param);
});

v9.on('read', function() {
    v9.write(new Date().getSeconds());
});

blynk.on('connect', function() { console.log("Blynk ready."); });
blynk.on('disconnect', function() { console.log("DISCONNECT"); });