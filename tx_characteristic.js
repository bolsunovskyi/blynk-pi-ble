var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

var TXCharacteristic = function() {
  TXCharacteristic.super_.call(this, {
    uuid: '6E400003-B5A3-F393-E0A9-E50E24DCCA9E',
    properties: ['read', 'notify'],
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'TX - Transfer Data (Notify)'
      })
    ]
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(TXCharacteristic, BlenoCharacteristic);

TXCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('TXCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

TXCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;
  console.log('withoutResponse', withoutResponse);
  console.log('TXCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('TXCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

TXCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('TXCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

TXCharacteristic.prototype.onUnsubscribe = function() {
  console.log('TXCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = TXCharacteristic;
