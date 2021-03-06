// initialze the application
angular.module('slacker', ['ionic','slacker.controllers','slacker.services','ionic-material'])
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {

      if (typeof hockeyapp !== 'undefined') {
        hockeyapp.start(
          function() {
            console.log('hockey started');
          },
          function() {
            console.log('hockey failed');
          },
          "9e4869fc9b824c798c675b287a7bd292",
          true);
        hockeyapp.checkForUpdate(
          function() {
            console.log('hockey check success');
          },
          function() {
            console.log('hockey check fail');
          });
      }
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)

      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  // set up the various states for the application
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    // menu state
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'SlackerCtrl'
    })

    .state('app.login', {
      url: '/login',
      views: {
        menuContent: {
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        }
      }
    })

    // listing of all of the channels in the currently-authenticated team
    .state('app.channels', {
      url: '/channels',
      views: {
        'menuContent': {
          templateUrl: 'templates/channels.html',
          controller: 'ChannelsCtrl'
        }
      }
    })

    // handle displaying whatever it is you want in a "channel"
    .state('app.channel', {
      url: '/channels/:channelId',
      views: {
        'menuContent': {
          templateUrl: 'templates/channel.html',
          controller: 'ChannelCtrl'
        }
      }
    })

    // handle
    .state('app.post', {
      url: '/post',
      views: {
        'menuContent': {
          templateUrl: 'templates/post.html',
          controller: 'PostCtrl'
        }
      }
    })

    // listing of the users in the currently authenticated team
    .state('app.users', {
      url: '/users',
      views: {
        'menuContent': {
          templateUrl: 'templates/users.html'
        }
      }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');

  });
