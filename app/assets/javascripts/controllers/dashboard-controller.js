'use strict';

function DashboardCtrl(socket, $scope, $rootScope, $http, $location, $timeout) {

  $scope.send = function() {
    $http({method: 'PUT', url: '/update'}).
      success(function(data, status, headers, config) {
        //console.log('Successfully Updated');
    }).
      error(function(data, status, headers, config) {
        //console.log('An error has occurred');
    });
  }

  var socket = io.connect('http://localhost:8003');
  socket.on('devices:update', function (data) {
    $scope.fire(data)
  })

  $scope.fire = function(data) {
    if (data.id == '1') {
      if (device.properties[0].value == 'on')
        { device.properties[0].value = device.properties[0].expected = 'off' }
      else
        { device.properties[0].value = device.properties[0].expected = 'on' }

      device.updated_at = new Date();
      $rootScope.$broadcast('lelylan:device:request:end', device);
      $scope.$apply();
    };
  };
};

DashboardCtrl.$inject = ['socket', '$scope', '$rootScope', '$http', '$location', '$timeout'];
