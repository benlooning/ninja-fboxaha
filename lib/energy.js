
var stream = require('stream')
  , util = require('util');

util.inherits(Energy,stream);

module.exports=Energy;

/**
 * Creates a new Device Object
 *
 * @property {Boolean} readable Whether the device emits data
 * @property {Boolean} writable Whether the data can be actuated
 *
 * @property {Number} G - the channel of this device
 * @property {Number} V - the vendor ID of this device
 * @property {Number} D - the device ID of this device
 *
 * @property {Function} write Called when data is received from the cloud
 *
 * @fires data - Emit this when you wish to send data to the cloud
 */
function Energy(box, index, logger, node) {

  var self = this;
  this.log = logger;
  this.readable = true;
  this.writeable = true;

  this.G = "E" + box.boxInfo.serial + box.ahaDevices[index].ID.replace(/ /gi, '').replace(/:/gi, ''); // G is a string a represents the channel
  this.V = 0; // 0 is Ninja Blocks' device list
  this.D = 242; // 2000 is a generic Ninja Blocks sandbox device
  
  this.guid = [node,this.G,this.V,this.D].join('_');
  self.log.info (self.guid, box._box.host, box.ahaDevices[index].ID.replace(/ /gi, '').replace(/:/gi, ''), 'here I am, your new energy meter!');
  
  process.nextTick(function() {
    self.getMeterState (box, index);
  });
};

/**
 * Called whenever there is data from the cloud
 * This is required if Device.writable = true
 *
 * @param  {String} data The data received
 */
Energy.prototype.write = function(data) {

};



/**
* helper
*
*/

Energy.prototype.getMeterState = function(box, index) {
  var self = this;
  box.ahaDevices[index].multiMeterEnergyTimer = setInterval(function() {
	box.getSwitchEnergy (box.ahaDevices[index].ID, function (error, state) {
	  if (error == null) {
		self.log.debug(self.guid, box._box.host, box.ahaDevices[index].ID, 'kwh:', state);
		self.emit('data', state / 1000000);
	  } else {
		self.log.info(self.guid, box._box.host, error);
		clearInterval(box.ahaDevices[index].multiMeterEnergyTimer);
		if (error == 'invalid SID') { //invalid SID
		  box.renewSID(function (error, info){
			if (error == null) {
			  self.log.info(self.guid, box._box.host, box.ahaDevices[index].ID, box.SID);
			  self.getMeterState (box, index);
			} else {
			  self.log.info(self.guid, box._box.host, error);
			}
		  });
		} else { //not invalid SID -> some other connectivity issue
		  setTimeout(function () {
		    self.getMeterState (box, index);
		  }, 30000);
		}
	  }
	});
  }, 30000);
}
