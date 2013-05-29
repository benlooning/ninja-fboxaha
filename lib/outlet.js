
var stream = require('stream')
  , util = require('util');

util.inherits(Outlet,stream);

module.exports=Outlet;

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
function Outlet(box, index, logger, node) {

  var self = this;
  this.log = logger;
  this.readable = true;
  this.writeable = true;

  this.G = "O" + box.boxInfo.serial + box.ahaDevices[index].ID; // G is a string a represents the channel
  this.V = 0; // 0 is Ninja Blocks' device list
  this.D = 244; // 2000 is a generic Ninja Blocks sandbox device
  
  this.guid = [node,this.G,this.V,this.D].join('_');
  self.log.info (self.guid, box._box.host, box.ahaDevices[index].ID, 'here I am, your new outlet!');

  process.nextTick(function() {
    self.getSwitchSate (box, index);
  });
  
  this.setSwitchSate = function(data) {
    var self = this;
    switch(data) {
      case 'on':
        box.switchOnOff (box.ahaDevices[index].ID, 1, function (error, state) {
        });
		self.log.debug (self.guid, box._box.host, box.ahaDevices[index].ID, 'set outlet state:', data);
		self.emit('data', 'on');
	    break;
      case 'off':
        box.switchOnOff (box.ahaDevices[index].ID, 0, function (error, state) {
        });
		self.log.debug (self.guid, box._box.host, box.ahaDevices[index].ID, 'set outlet state:', data);
		self.emit('data', 'off');
	    break
      default:
	  //self.emit('data', 'unknown');
    }	
  }

};

/**
 * Called whenever there is data from the cloud
 * This is required if Device.writable = true
 *
 * @param  {String} data The data received
 */
Outlet.prototype.write = function(data) {
 var self = this;
 self.setSwitchSate(data);
};

/**
* helper
*
*/

Outlet.prototype.getSwitchSate = function(box, index) {
  var self = this;
  box.ahaDevices[index].outletTimer = setInterval(function() {
	box.getSwitchState (box.ahaDevices[index].ID, -1, function (error, state) {
	  if (error == null) {
		self.log.debug (self.guid, box._box.host, box.ahaDevices[index].ID, 'got outlet state:', state.Value);	
		switch(parseInt(state.Value)) {
		  case 1:
		    self.emit('data', 'on');
		    break;
		  case 0:
		    self.emit('data', 'off');
		    break
		  default:
		    self.emit('data', 'unknown');
		}	
	  } else {
		self.log.info(self.guid, box._box.host, error);
		clearInterval(box.ahaDevices[index].outletTimer);
		if (error == 'invalid SID') { //invalid SID
		  box.renewSID(function (error, info){
			if (error == null) {
			  self.log.info(self.guid, box._box.host, box.ahaDevices[index].ID, box.SID);
			  self.getSwitchSate (box, index);
			} else {
			  self.log.info(self.guid, box._box.host, error);
			}
		  });
		} else { //not invalid SID -> some other connectivity issue
		  setTimeout(function () {
		    self.getSwitchSate (box, index);
		  }, 30000);
		}
	  }
	});
  }, 30000);
}




