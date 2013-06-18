'use strict';

function DashboardCtrl($scope, $rootScope, $http, $location, $timeout) {

  $scope.send = function() {
    console.log('Sending request');
    $http({method: 'PUT', url: '/update'}).
      success(function(data, status, headers, config) {
        console.log('Successfully Updated');
    }).
      error(function(data, status, headers, config) {
        console.log('An error has occurred');
    });
  };
};

DashboardCtrl.$inject = ['$scope', '$rootScope', '$http', '$location', '$timeout'];
