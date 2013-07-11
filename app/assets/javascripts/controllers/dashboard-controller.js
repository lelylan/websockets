'use strict';

function DashboardCtrl($scope, $rootScope, $http, $location, $timeout) {

  var status = 'on';
  $scope.connected = false;

  $scope.test = function() {
    $http({method: 'PUT', url: '/test'});
  }

  var socket = io.connect('');

  var room = 'token-1';

  socket.on('connect', function() {
    socket.emit('subscribe', room);
  });

  socket.on('update', function (event) {
    console.log("Yotta")
    $scope.fire(event.data);
    $scope.$apply();
  })

  socket.on('connected', function (event) {
    $scope.connected = true;
    $scope.$apply();
  })

  socket.on('disconnected', function (event) {
    $scope.connected = false;
    $scope.$apply();
  })

  $scope.fire = function(resource) {
    if (resource.id == '1') {
      status = (status == 'on') ? 'off' : 'on';
      resource.properties[0].value = resource.properties[0].expected = status;
      resource.updated_at = new Date();
      $rootScope.$broadcast('lelylan:device:request:end', resource);
    };
  };
};

DashboardCtrl.$inject = ['$scope', '$rootScope', '$http', '$location', '$timeout'];
