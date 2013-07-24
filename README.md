# Websockets realtime service

Realtime service for [Lelylan Dashboard](https://github.com/lelylan/devices-dashboard-ng)


## Requirements

The Realtime service is tested against Node 0.8.8.


## Installation

Clone the repository.

    git clone git@github.com:lelylan/websockets.git

Run Node server using [foreman](https://github.com/NodeFly/node-foreman).

    nf start


## Deploy

* Run `deploy production`


## How does it work

The realtime system is based on the OAuth2 access token. Any time a resource is updated
(an event is created) this is what happens.

* Find all valid access token granted by the user when a owned device is updated.
* Broadcast the device changes to all clients who registered to the service with a valid access token.


## Getting Started

The realtime service can be integrated in any client who has access to a valid access token.

Include the socket.io library.

```html
  <script src="socket.io/socket.io.js"></script>
```

Connect to the realtime server and sync the device component.
In this example we define an AngularJS controller.

```javascript
function DashboardCtrl($scope, AccessToken) {
  var authorized = (!!AccessToken.get().access_token);

  if (authorized) {
    var socket = io.connect('http://96.126.109.170:80');

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

See [Lelylan Dashboard](https://github.com/lelylan/devices-dashboard-ng) to see a real usage example.


## Live testing

Production verison.

* Open [index.html](http://96.126.109.170/)

Development version (locally).

* Run `nf start`
* Open [index.html](http://localhost:8003/)


## Resources

* [Socket IO](http://socket.io/)
* [Lelylan Dashboard](https://github.com/lelylan/devices-dashboard-ng)


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

Use the [issue tracker](http://github.com/lelylan/websockets/issues) for bugs.
[Mail](mailto:touch@lelylan.com) or [Tweet](http://twitter.com/lelylan) us for any idea that can improve the project.


## Links

* [GIT Repository](http://github.com/lelylan/websockets)
* [Lelylan Dashboard](https://github.com/lelylan/devices-dashboard-ng)
* [Lelylan Dev Center](http://dev.lelylan.com)
* [Lelylan Site](http://lelylan.com)

## Authors

[Andrea Reginato](http://twitter.com/andreareginato)

## Contributors

Special thanks to the [following people](https://github.com/lelylan/websockets/contributors) for submitting patches.

## Changelog

See [CHANGELOG](websockets/blob/master/CHANGELOG.md)

## Copyright

Copyright (c) 2013 [Lelylan](http://lelylan.com). See [LICENSE](websockets/blob/master/LICENSE.md) for details.
