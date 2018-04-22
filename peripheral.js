var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;
var BlenoDescriptor = bleno.Descriptor;

var RXCharacteristic = require('./rx_characteristic');
var TXCharacteristic = require('./tx_characteristic');

exports.BLEService = function(options){
  var name = "BlynkJS";
  if (options.advertiseName) {
    name = options.advertiseName;
  }

  bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
      bleno.startAdvertising(name, ['6E400001-B5A3-F393-E0A9-E50E24DCCA9E']);
    } else {
      bleno.stopAdvertising();
    }
  });

  bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

    if (!error) {
      bleno.setServices([
        new BlenoPrimaryService({
          uuid: '6E400001-B5A3-F393-E0A9-E50E24DCCA9E',
          characteristics: [
            new RXCharacteristic(),
            new TXCharacteristic()
          ],
          descriptors: [
            new BlenoDescriptor({
              uuid: '2901',
              value: 'UART'
            })
          ]
        })
      ]);
    }
  });

  return {
    RXCharacteristic: RXCharacteristic,
    TXCharacteristic: TXCharacteristic
  };
};