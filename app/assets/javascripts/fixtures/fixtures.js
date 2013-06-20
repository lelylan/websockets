'use strict';

// ----------
// Devices
// ----------

// Light
var device = {
  uri: 'http://api.lelylan.com/devices/1',
  id: '1',
  name: 'First Light',
  type: { uri: 'http://api.lelylan.com/types/1', id: '1' },
  physical: { uri: 'http://arduino.house.com/1' },
  pending: false,
  properties: [{
    uri: 'http://api.lelylan.com/properties/1',
    id: '1', value: 'on', expected: 'on', pending: false,
    accepted: {'on': 'On', 'off': 'Off'}
  }, {
    uri: 'http://api.lelylan.com/properties/2',
    id: '2', value: '50', expected: '50', pending: false,
    accepted: {}
  }],
  maker: { id: '1' },
  owner: { id: '1' },
  created_at: '2012-09-01T16:00:32Z',
  updated_at: '2013-04-10T16:19:20Z',
  updated_from: 'Andrea Reginato'
};

// Second light
var device2 = angular.copy(device);
device2.id  = '2';
device2.name = 'Second Light'
device2.uri = 'http://api.lelylan.com/devices/2';
device2.physical = null;
device2.maker.id = 2;

// Third light
var device3 = angular.copy(device);
device3.id  = '3';
device3.uri = 'http://api.lelylan.com/devices/3';

// Forth light
var device4 = angular.copy(device);
device4.id  = '4';
device4.uri = 'http://api.lelylan.com/devices/4';

// ----------
// Types
// ----------

// Type fixture
var type = {
  uri: 'http://api.lelylan.com/types/1',
  id: '1',
  name: 'Basic Light',
  description: 'The **Basic Light** type represents the most basic light structure.',
  categories: ['lights'],
  created_at: '2012-09-01T15:01:22Z',
  updated_at: '2012-09-01T15:01:22Z',
  creator_id: '1',
  owner: { id: '1' },
  properties: [{
    uri: 'http://api.lelylan.com/properties/1',
    id: '1',
    name: 'Status',
    default: 'off',
    accepted: {'on': 'On', 'off': 'Off'},
    type: 'text'
  }, {
    uri: 'http://api.lelylan.com/properties/2',
    id: '2',
    name: 'Intensity',
    default: '0',
    accepted: null,
    type: 'range',
    range: { min: 0, max: 100, step: 1 }
  }],
  functions: [{
    uri: 'http://api.lelylan.com/functions/1',
    id: '1',
    name: 'Turn On',
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      expected: 'on',
      pending: true
    }]
  }, {
    uri: 'http://api.lelylan.com/functions/2',
    id: '2',
    name: 'Turn Off',
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      expected: 'off',
      pending: true
    }]
  }],
  statuses: [{
    uri: 'http://api.lelylan.com/statuses/1',
    id: '1',
    name: 'The light is on',
    function: { uri: 'http://api.lelylan.com/functions/2', id: '2' },
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      values: ['on'],
      pending: null,
    }]
  }, {
    uri: 'http://api.lelylan.com/statuses/2',
    id: '2',
    name: 'The light is off',
    function: { uri: 'http://api.lelylan.com/functions/1', id: '1' },
    properties: [{
      uri: 'http://api.lelylan.com/properties/1',
      id: '1',
      values: ['off'],
      pending: null,
    }]
  }]
};

var privates = {
  "uri": "http://api.lelylan.com/devices/1",
  "id": "1",
  "name": "Light",
  "secret": "0ca70cc411e9e9de25b47b3e76b8a1932ae48bee6e6fa8808b534994dff5045d",
  "activation_code": "3a9e8732e30c7c06031ad28fd5310425bca3d9bc",
}
