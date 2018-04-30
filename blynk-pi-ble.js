var BlynkLib = require('blynk-library');
var blePeripheral = require('./pi-ble');
var net = require('net');

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

var unixClient = net.createConnection("/tmp/led_cloud");
var socketConnected = false;

unixClient.on("connect", function() {
    socketConnected = true;
});


var rgb = new blynk.VirtualPin(1);
var v9 = new blynk.VirtualPin(9);

rgb.on('write', function(param) {
    if (param.length == 3) {
        var r = parseInt(param[0]);
        var g = parseInt(param[1]);
        var b = parseInt(param[2]);
        var rgb = rgb | g << 16;
        rgb = rgb | r << 8;
        rgb = rgb | b;
        
        if (socketConnected) {
            unixClient.write(rgb.toString());
        }
    }
});

v9.on('read', function() {
    v9.write(new Date().getSeconds());
});

blynk.on('connect', function() { console.log("Blynk ready."); });
blynk.on('disconnect', function() { console.log("DISCONNECT"); });