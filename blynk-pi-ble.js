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
};

var blynk = new BlynkLib.Blynk('c4151dbd817a491a9e64f5354bb021ad', options = {
    connector: new blePeripheral.BLEPeripheral()
});

var v1 = new blynk.VirtualPin(1);
var v2 = new blynk.VirtualPin(2);
var v3 = new blynk.VirtualPin(3);
var v4 = new blynk.VirtualPin(4);
var v5 = new blynk.VirtualPin(5);

v1.on('write', function(param) {
    console.log('V1:', param);
});

v2.on('write', function(param) {
    console.log('V2:', param);
});

v3.on('write', function(param) {
    console.log('V3:', param);
});

v4.on('write', function(param) {
    console.log('V4:', param);
});

v5.on('write', function(param) {
    console.log('V5:', param);
});

blynk.on('connect', function() { console.log("Blynk ready."); });
blynk.on('disconnect', function() { console.log("DISCONNECT"); });