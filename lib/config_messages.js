exports.selectBox = {
  "contents":[
    { "type":"paragraph",    "text":"please choose the box you wish to edit"},
    { "type": "input_field_select", "field_name": "box", "label": "", "options": [{ "name": "None", "value": "", "selected": true}], "required": false },
    { "type":"submit"   ,    "name": "edit", "rpc_method": "show_settings" },{ "type":"submit"   ,    "name": "remove", "rpc_method": "remove_box" },{ "type":"submit"   ,    "name": "reconnect", "rpc_method": "reconnect_box" }
  ]
};

exports.reconnectMessage = {
  "contents": [
    { "type":"paragraph",    "text":"Trying to reconnect to the selected box. This will generate a new SID if required and also detect new aha devices."},
    { "type":"close", "text":"close"}
  ]
}

exports.saveSuccess = {
  "contents": [
    { "type":"paragraph",    "text":"Your settings have been saved."},
    { "type":"close", "text":"close"}
  ]
}

exports.removeSuccess = {
  "contents": [
    { "type":"paragraph",    "text":"The selected settings have been removed."},
    { "type":"close", "text":"close"}
  ]
}

exports.finish = {
  "finish": true
};

