var events = require('events');
var util = require('util');

function strToBuffer(str) {
    var sl = [];
    for (var i=0;i<str.length;i++) {
        sl.push(str.charCodeAt(i));
    }

    return new Buffer(sl);
}

exports.BLEPeripheral = function(options) {
    var self = this;
    events.EventEmitter.call(this);


    this.connect = function(done) {
        self.per = require("./peripheral");

        self.per.RXCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
            self.emit('data', data);
            callback(this.RESULT_SUCCESS);
        };

        self.per.TXCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
            console.log('TXCharacteristic - onSubscribe');
            self.per.updateValueCallback = updateValueCallback;
        };

        self.per.TXCharacteristic.prototype.onUnsubscribe = function(){
            console.log('TXCharacteristic - onUnsubscribe');
            self.per.updateValueCallback = null;
        };

        done();
    };

    this.disconnect = function(){
        console.log('disconnect');
    };

    this.write = function(data) {
        if (self.per.updateValueCallback) {
            self.per.updateValueCallback(strToBuffer(data));
        }
    };
};

util.inherits(exports.BLEPeripheral, events.EventEmitter);