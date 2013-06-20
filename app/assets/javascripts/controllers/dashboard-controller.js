'use strict';

function DashboardCtrl($scope, $rootScope, $http, $location, $timeout) {

  var status = 'on';
  $scope.connected = false;

  $scope.test = function() {
    $http({method: 'PUT', url: '/test'});
  }

  var socket = io.connect('/');

  socket.on('token-1', function (event) {
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
