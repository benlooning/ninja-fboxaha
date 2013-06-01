
var stream = require('stream')
  , util = require('util');

util.inherits(Socket,stream);

module.exports=Socket;

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
function Socket(box, index, logger, node) {

  var self = this;
  this.log = logger;
  this.readable = true;
  this.writeable = true;

  this.G = "R" + box.boxInfo.serial + box.ahaDevices[index].ID.replace(/ /gi, '').replace(/:/gi, ''); // G is a string a represents the channel
  this.V = 0; // 0 is Ninja Blocks' device list
  this.D = 1002; //1009; // 2000 is a generic Ninja Blocks sandbox device
  
  this.guid = [node,this.G,this.V,this.D].join('_');
  self.log.info (self.guid, box._box.host, box.ahaDevices[index].ID.replace(/ /gi, '').replace(/:/gi, ''), 'here I am, your new socket!');

  process.nextTick(function() {
    self.getSwitchState (box, index);
  });
  
  this.setSwitchSate = function(data) {
    var self = this;
    switch(data) {
      case '1':
        box.setSwitchON (box.ahaDevices[index].ID, function (error, state) {
        });
		self.log.debug (self.guid, box._box.host, box.ahaDevices[index].ID, 'set socket state:', data);
		self.emit('data', '1');
	    break;
      case '0':
        box.setSwitchOFF (box.ahaDevices[index].ID, function (error, state) {
        });
		self.log.debug (self.guid, box._box.host, box.ahaDevices[index].ID, 'set socket state:', data);
		self.emit('data', '0');
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
Socket.prototype.write = function(data) {
 var self = this;
 self.setSwitchSate(data);
};

/**
* helper
*
*/

Socket.prototype.getSwitchState = function(box, index) {
  var self = this;
  box.ahaDevices[index].socketTimer = setInterval(function() {
	box.getSwitchState (box.ahaDevices[index].ID, function (error, state) {
	  if (error == null) {
		self.log.debug (self.guid, box._box.host, box.ahaDevices[index].ID, 'got socket state:', state);	
		switch(state) {
		  case '1':
		    self.emit('data', '1');
		    break;
		  case '0':
		    self.emit('data', '0');
		    break
		  default:
		    self.emit('data', 'unknown');
		}	
	  } else {
		self.log.info(self.guid, box._box.host, error);
		clearInterval(box.ahaDevices[index].socketTimer);
		if (error == 'invalid SID') { //invalid SID
		  box.renewSID(function (error, info){
			if (error == null) {
			  self.log.info(self.guid, box._box.host, box.ahaDevices[index].ID, box.SID);
			  self.getSwitchState (box, index);
			} else {
			  self.log.info(self.guid, box._box.host, error);
			}
		  });
		} else { //not invalid SID -> some other connectivity issue
		  setTimeout(function () {
		    self.getSwitchState (box, index);
		  }, 30000);
		}
	  }
	});
  }, 30000);
}



