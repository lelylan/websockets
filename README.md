# Relatime service for Lelylan Dashboard

Realtime service for [Lelylan Dashboard](https://github.com/lelylan/devices-dashboard-ng)


## Requirements

The Realtime service is tested against Node 0.8.8.


## Installation

Clone the repository.

    git clone git@github.com:lelylan/websockets.git

Run Node server.

    foreman start


## Deploy

Follow [Node.js on Heroku](https://devcenter.heroku.com/articles/nodejs).


## How does it work

The realtime system is based on the OAuth2 access token. Any time a resource is updated
(an event is created) this is what happens.

* Find all valid access token for the resource owner of the updated device.
* Broadcast the device changes to the client who registered to the service.


## Getting Started

The realtime service can be integrated in any client who has access to a valid access token.

Include the socket.io library.

```html
<script src="socket.io/socket.io.js"></script>
```

Connect to the realtime server and sync the device component.

```
var socket = io.connect('realtime.lelylan.appfog.com');
socket.on('devices:update', function (data) {
  $scope.fire(data);
})

$scope.fire = function(device) {
  $rootScope.$broadcast('lelylan:device:request:end', device);
};
```


### Live testing

* Run `foreman start`
* Open [index.html](http://localhost:8003/index.html)


## Resources

* [Socket IO](http://socket.io/)
* [Lelylan Dashboard](https://github.com/lelylan/devices-dashboard-ng)


## Contributing

Fork the repo on github and send a pull requests with topic branches.
Do not forget to provide specs to your contribution.

### Running specs

* Fork and clone the repository
* Run `npm inspall`
* Run `foreman start`
* Run `foreman run mocha spec/app.spec.js`


## Coding guidelines

Follow [github](https://github.com/styleguide/) guidelines.

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
