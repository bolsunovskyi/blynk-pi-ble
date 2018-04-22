var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

var RXCharacteristic = function() {
  RXCharacteristic.super_.call(this, {
    uuid: '6E400002-B5A3-F393-E0A9-E50E24DCCA9E',
    properties: ['writeWithoutResponse', 'write'],
    // properties: ['read', 'write', 'writeWithoutResponse', 'notify', 'indicate'],
    // value: null,
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'RX - Receive Data (Write)'
      })
    ]
  });

  this._value = new Buffer(0);
  this.buff_in = '';

  this._updateValueCallback = null;
};

util.inherits(RXCharacteristic, BlenoCharacteristic);

RXCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('RXCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

RXCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('EchoCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('EchoCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

RXCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('RXCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

RXCharacteristic.prototype.onUnsubscribe = function() {
  console.log('RXCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = RXCharacteristic;
