var messages = require('./config_messages');

var host = '';
var user = '';
var password = '';
var index = '';
  
exports.probe = function(cb) {
  var self = this;
  var toShow = messages.selectBox;

  var optionArr = [];
  optionArr.push({name: 'create new (via edit button)', value: 'create'});

  self.boxesObj.forEach ( function(box) {
    optionArr.push({name:box.boxInfo.type + ' (' + box._box.host +')',value:box._box.host});
  });
  
  if (optionArr.length>0) {
    toShow.contents[1].options = optionArr;
  }

  cb(null,toShow);
};

exports.reconnect_box = function(params,cb) {
	var self = this;
	var selectedBox = null;

	self.boxesObj.forEach ( function(box) {
	  if (box._box.host == params.box) {
		selectedBox = box;
	  }
	});

	if (selectedBox != null) {
		self.connectToBox(selectedBox);
	} else {
		//TODO exit without message
	}
  cb(null,messages.reconnectMessage);
};

exports.show_settings = function(params,cb) {
  var self = this;
  var selectedBox = null;
  var selectedIndex = null;
  
  var newStations = [];

  var toSend = {
    "contents":[
		{ "type":"paragraph",  "text":"Here you are able to manage your box settings."}
    ]
  }

  self._opts.boxes.forEach ( function(box, index) {
	  if (box.host == params.box) {
		selectedBox = box;
		selectedIndex = index;
    }
  });

  if (selectedBox == null) {
    host = '';
	user = '';
	password = '';
	index = null;
  } else {
    host = selectedBox.host;
    user = selectedBox.user;
    password = selectedBox.password;
    index = selectedIndex;
  }
  newStations.push({ "type":"input_field_text", "field_name": "host", "value": host, "label": "host", "placeholder": "192.168.178.1", "required": true});
  newStations.push({ "type":"input_field_text", "field_name": "user", "value": user, "label": "user", "placeholder": "ninja", "required": true});
  newStations.push({ "type":"input_field_text", "field_name": "password", "value": password, "label": "password", "placeholder": "123456", "required": true});
  newStations.push({ "type": "submit", "name": "save", "rpc_method": "save_settings" });
  //newStations.push({ "type": "input_field_hidden", "field_name": "index", "value": index});
  newStations.push( { "type": "close", "text": "cancel"});
  
  toSend.contents = toSend.contents.concat(newStations);
  cb(null,toSend);
};

exports.save_settings = function(params,cb) {
	var self = this; 
	
	host = params.host;
	user = params.user;
	password = params.password;

    if (index == null) {
	  index = self._opts.boxes.length;
	}

	if (host) {
	  var boxSettings = {
		host: host,
		user: user,
		password: password
	  };

	  if (index == self._opts.boxes.length) {
	    self.createBox(boxSettings, function(newBox) {
		  self.connectToBox(newBox);
		  self._opts.boxes[index] = boxSettings;
	      self.save();
	    });
	  } else {
	    self._opts.boxes[index] = boxSettings;
	    self.save();
	    self.connectToBox(self.boxesObj[index]);
	  }
	  cb(null,messages.saveSuccess);
	} else {
	
	}

};

exports.remove_box = function(params,cb) {
  var self = this;
  var selectedBox = null;
  var selectedIndex = null;
  
  self.boxesObj.forEach ( function(box, index) {
    if (box._box.host == params.box) {
  	  selectedBox = box;
	  selectedIndex = index;
	}
  });

  if (selectedBox != null) {
    selectedBox.ahaDevices.forEach ( function(device) {
      clearInterval(device.outletTimer);
	  clearInterval(device.multiMeterTimer);
	});
	self._opts.boxes.splice(selectedIndex, 1);
	self.save();
	self.boxesObj.splice(selectedIndex, 1);
  } else {
	//TODO exit without message
  }
  cb(null,messages.removeSuccess);
};

