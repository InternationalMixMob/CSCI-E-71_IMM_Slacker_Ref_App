angular.module('slacker.controllers', ['slacker.services'])

  .controller('SlackerCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
    };
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

    // we want to reload the channels when we load this page
    $scope.$on('$ionicView.enter', function(e) {
      SlackerService.refreshChannels(updateListing);
    });
  })

  // the channel controller, needs to do very little for now
  .controller('ChannelCtrl', function($scope, $stateParams) {

  })

  .controller('PostsCtrl', function($scope) {
    $scope.data = {};
    $scope.data.message = "";
    $scope.data.response = "";

    var successCallback = function(message) {
      console.log("Success: " + message);
      $scope.data.response = message;
    };

    var failureCallback = function(message) {
      console.log("Failure: " + message);
    };

    $scope.postMessage = function(data){

      if (typeof Slacker === 'undefined') {
        console.log("Var Slacker not define, maybe running in web browser");
        data.response += 1;
      } else {
        // Found it we are good to go
        console.log("Var Slacker found, running in mobile app");
        Slacker.postMessage(successCallback, failureCallback, data.message);
      }

      return ;
    };

    $scope.resetMessage = function(data){
      console.log("Called Reset");
      data.message = "";
      data.response = "";
    }
  });
