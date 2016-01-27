# Websockets realtime service

Realtime service for Lelylan.


## Requirements

Lelylan Websockets is tested against Node 0.8.8.


## Installation

    $ git clone git@github.com:lelylan/websockets.git
    $ npm install && npm install -g foreman
    $ nf start


## Resources

The basic logic behind the websocket microservcie is that when a physical device is updated, changes are broadcasted to all clients who registered to the service with a valid access token.

## Tutorial

The realtime service can be integrated in any client who has access to a valid access token.

Install the socket.io library.

```html
  <script src="socket.io/socket.io.js"></script>
```

Connect to the realtime server and sync the device component.

```javascript
function DashboardCtrl($scope, AccessToken) {
  var authorized = (!!AccessToken.get().access_token);

  if (authorized) {
    // connect to the Websocket service
    var socket = io.connect('http://localhost');

    socket.on(AccessToken.get().access_token, function (event) {
      $scope.fire(event.data);
      $scope.$apply(); // needed to refresh the page changes
    });

    $scope.fire = function(device) {
      $rootScope.$broadcast('lelylan:device:request:end', device);
    };

    socket.on('connected', function (event) {
      $scope.connected = true;
      $scope.$apply();
    })

    socket.on('disconnected', function (event) {
      $scope.connected = false;
      $scope.$apply();
    })
  }
}

DashboardCtrl.$inject = ['$scope', 'AccessToken'];
```

See [Lelylan Dashboard](https://github.com/lelylan/devices-dashboard-ng) for the actual implementation.


## Resources

* [Lelylan Dashboard](https://github.com/lelylan/devices-dashboard-ng)
* [Socket IO](http://socket.io/)


## Contributing

Fork the repo on github and send a pull requests with topic branches.
Do not forget to provide specs to your contribution.

### Running specs

* Fork and clone the repository
* Run `npm install`
* Run `npm test`


## Coding guidelines

Follow [Felix](http://nodeguide.com/style.html) guidelines.


## Feedback

Use the [issue tracker](http://github.com/lelylan/websockets/issues) for bugs or [stack overflow](http://stackoverflow.com/questions/tagged/lelylan) for questions.
[Mail](mailto:dev@lelylan.com) or [Tweet](http://twitter.com/lelylan) us for any idea that can improve the project.


## Links

* [GIT Repository](http://github.com/lelylan/websockets)
* [Lelylan Dev Center](http://dev.lelylan.com)
* [Lelylan Site](http://lelylan.com)


## Authors

[Andrea Reginato](https://www.linkedin.com/in/andreareginato)


## Contributors

Special thanks to all [contributors](https://github.com/lelylan/websockets/contributors)
for submitting patches.


## Changelog

See [CHANGELOG](https://github.com/lelylan/websockets/blob/master/CHANGELOG.md)


## License

Lelylan is licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).
