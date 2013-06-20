'use strict';

function DashboardCtrl($scope, $rootScope, $http, $location, $timeout) {

  var status = 'on';
  $scope.connected = false;

  $scope.send = function() {
    $http({method: 'PUT', url: '/update'});
  }

  var socket = io.connect('http://localhost:8003');

  socket.on('devices:update', function (event) {
    $scope.fire(event.data);
    $scope.$apply();
  })

  socket.on('connected', function (event) {
    $scope.connected = true;
    $scope.$apply();
  })

  socket.on('disconnected', function (event) {
    console.log('disconnect', $scope.connected);
    $scope.$apply();
  })

  $scope.fire = function(resource) {
    if (resource.id == '1') {
      status = (status == 'on') ? 'off' : 'on';
      resource.properties[0].value = resource.properties[0].expected = status;
      console.log(resource.properties[0]);
      resource.updated_at = new Date();
      $rootScope.$broadcast('lelylan:device:request:end', resource);
    };
  };
};

DashboardCtrl.$inject = ['$scope', '$rootScope', '$http', '$location', '$timeout'];
