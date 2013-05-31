var Power = require('./lib/power')
  , Outlet = require('./lib/outlet')
  , util = require('util')
  , configHandlers = require('./lib/config')
  , stream = require('stream')
  , FBox = require('fbox.js');

util.inherits(fboxaha,stream);

/**
 * Called when our client starts up
 * @constructor
 *
 * @param  {Object} opts Saved/default module configuration
 * @param  {Object} app  The app event emitter
 * @param  {String} app.id The client serial number
 *
 * @property  {Function} save When called will save the contents of `opts`
 * @property  {Function} config Will be called when config data is received from the cloud
 *
 * @fires register - Emit this when you wish to register a device (see Device)
 * @fires config - Emit this when you wish to send config data back to the cloud
 */
function fboxaha(opts,app) {

  var self = this;
  this._app = app;
  this._opts = opts;
  this.boxesObj = [];
  
  app.on('client::up',function(){

    self.appName = 'fbox aha Ninja Module 0.1';

    if (typeof self._opts.boxes === "undefined") {
	  self._opts.boxes = []; //{host: '', user: '', password: ''}
	  self.save();
    }  

	self._opts.boxes.forEach ( function (box) {
	  self.createBox(box, function(newBox){
	    self.connectToBox (newBox);
	  });
	});
 
  });
};

/**
 * Called when config data is received from the cloud
 * @param  {Object} config Configuration data
 */
fboxaha.prototype.config = function(rpc, cb) {

  var self = this;
  
  if (!rpc) {
    return configHandlers.probe.call(this,cb);
  }

  switch (rpc.method) {
    case 'show_settings':             return configHandlers.show_settings.call(this,rpc.params,cb);  break;
    case 'save_settings':             return configHandlers.save_settings.call(this,rpc.params,cb);  break;
    case 'remove_box':                return configHandlers.remove_box.call(this,rpc.params,cb);     break;
	case 'reconnect_box':             return configHandlers.reconnect_box.call(this,rpc.params,cb);  break;
    default:                          return cb(true);                                               break;
  }
};

/**
* helper
*
*/

fboxaha.prototype.createBox = function (boxSettings, cb) {
  var self = this;
  self.boxesObj.push(FBox.createBox(boxSettings));
  cb (self.boxesObj[self.boxesObj.length - 1])
}

fboxaha.prototype.connectToBox = function (box) {
  var self = this;
  box.validateBox ( function (error, boxInfo) {
	if (error == null) {
	  self.log.info('try to connect to', box._box.host);
	  if (box.SID == null) {
		box.createSession (null, function (error, info) {
		  if (error == null) {
			self.log.info (box._box.host, box.SID);
			self.createDevices (box);
			self.log.debug('connect to', box._box.host, 'was successful');
		  } else {
			self.log.info(box._box.host, error);
		  }
		});
	  } else {
		self.log.debug('connection to', box._box.host, 'already exists');
		self.createDevices (box);
	  }	  
	}
  });
}

fboxaha.prototype.createDevices = function (box) {
  var self = this;
  box.getAHADevices ( function (error, devices) {
	if (error == null && box.ahaDevices != null) {
	  box.ahaDevices.forEach ( function (device, index) {
		self.log.debug(box._box.host, box.ahaDevices[index].ID);
		if (device.multiMeterTimer == null)
		  self.emit('register', new Power(box, index, self._app.log, self._app.id));
		else
		  self.log.debug('skipp power device', box._box.host, box.ahaDevices[index].ID);
		if (device.outletTimer == null)
		  self.emit('register', new Outlet(box, index, self._app.log, self._app.id));
		else
		  self.log.debug('skipp outlet device', box._box.host, box.ahaDevices[index].ID);
	  });
	} else {
	  self.log.info(box._box.host, error);
	}
  });
}

module.exports = fboxaha;