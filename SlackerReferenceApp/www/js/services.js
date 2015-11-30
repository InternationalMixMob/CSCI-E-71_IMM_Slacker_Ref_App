angular.module('slacker.services', [])

  .factory('slackerPluginService', function($http) {
    return {
        getUser: function() {
        console.log("NOT IMPLEMENTED");
        return {name: "ME"}
      },

      authorizeWithSlack: function() {
        console.log("NOT IMPLEMENTED");
      },

      destroySlackTokens: function() {
        console.log("NOT IMPLEMENTED");
      },

      postToSlack: function() {
        console.log("NOT IMPLEMENTED");
      },
    } 
  });
