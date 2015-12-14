angular.module('slacker.controllers', ['slacker.services'])

  .controller('SlackerCtrl', function($rootScope, $scope, SlackerService) {

    // Listen to changes for login status
    $rootScope.$on('$loginChanged', function() {
      $scope.loggedIn = SlackerService.loggedIn();
    });

    // Run first time to initialize
    $scope.loggedIn = SlackerService.loggedIn();
  })

  .controller('LoginCtrl', function($scope, $state, $ionicHistory, SlackerService) {
    var successFunc = function () {
      $ionicHistory.nextViewOptions({disableBack: true});
      $state.go('app.channels');
    };

    $scope.doLogin = function () {
      SlackerService.authenticate(successFunc);
    }
  })

  // handles the overall channels view, retrieving the channels we can get
  .controller('ChannelsCtrl', function($scope, SlackerService) {
    // what's bound to our view
    $scope.channels = [];

    // in the case we successfully got back a channel listing, deal with it
    var updateListing = function(channels) {
      // make sure we didn't get no channels back...
      if (channels.length) {
        $scope.channels = channels;
        // and update the view
        $scope.$apply();
      }
    };

    // if it failed, we need to do something
    var failureCallback = function(message) {
      console.err(message);
    };

    // we want to reload the channels when we load this page
    $scope.$on('$ionicView.enter', function(e) {
      SlackerService.getChannelList(updateListing, failureCallback, true);
    });
  })

  // the channel controller, needs to do very little for now
  .controller('ChannelCtrl', function($scope, $stateParams, $location, $ionicHistory, SlackerService) {
    // on enter we need to get our new channel
    $scope.$on('$ionicView.enter', function(e) {
      $scope.channel = SlackerService.getChannel($stateParams.channelId);
      if (!$scope.channel) {
        console.log('no channel found, redirecting');
        $ionicHistory.nextViewOptions({disableBack: true});
        $location.path('#/app/channels');
      }
    });

    $scope.data = {};
    $scope.data.message = '';
    $scope.data.response = '';

    // now we're going to post a message to that channel
    // on success, log it and echo it back into the view
    var successCallback = function(message) {
      console.log("Success: " + message);
      $scope.data.response = message;
      $scope.$apply();
    };

    // on failure... do the same
    var failureCallback = function(message) {
      console.log("Failure: " + message);
      $scope.data.response = message;
      $scope.$apply();
    };

    // post the message on submit
    $scope.postMessage = function(data) {
      SlackerService.postMessage(successCallback, failureCallback, data.message, $scope.channel.id);
    };
  })

  // post controller
  .controller('PostCtrl', function($scope, SlackerService) {
    $scope.data = {};
    $scope.data.message = "";
    $scope.data.response = "";

    // on success, log it and echo it back into the view
    var successCallback = function(message) {
      console.log("Success: " + message);
      $scope.data.response = message;
      $scope.$apply();
    };

    // on failure... do the same
    var failureCallback = function(message) {
      console.log("Failure: " + message);
      $scope.data.response = message;
      $scope.$apply();
    };

    // just pass this off to the service
    $scope.postMessage = function(data){
      SlackerService.postMessage(successCallback, failureCallback, data.message, null);
    };

    // clean everything up
    $scope.resetMessage = function(data){
      console.log("Called Reset");
      data.message = "";
      data.response = "";
    }
  });
