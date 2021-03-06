angular.module('slacker.services', [])

  // everything we could need from our Slacker servie
  .factory('SlackerService', function($rootScope) {
    /*
     * private state variables
     */
    // the list of channels
    var _channels = [];
    var _currentChannel = null;
    var _NUM_CHANNEL_RETRIES = 6;
    var _CHANNEL_RETRY_DELAY = 500;
    var _loggedIn = false;

    // helper to retrieve the channels - handles the case where the plugin isn't available
    var _retrieveChannels = function(success, failure, num) {
      // give up after a bit and return defaults (i.e. no slacker exists)
      if (num >= _NUM_CHANNEL_RETRIES) {
        success([{name:'Channel1', id:'1'}, {name:'Channel2', id:'2'}, {name:'Channel3', id:'3'}]);
      }
      // make sure we have Slacker, and if not, wait a bit
      else if (typeof Slacker === 'undefined' || typeof Slacker.getChannelList === 'undefined') {
        console.log('Slacker not ready, waiting 500ms');
        setTimeout(_retrieveChannels, _CHANNEL_RETRY_DELAY, success, failure, ++num);
      }
      // now we ge to actually make the call to the plugin
      else {
        Slacker.getChannelList(success, failure, true);
      }
    };

    /*
     * what we actually expose to the controllers
     */
    return {
      authenticate: function (success) {
        var wrapSuccess = function () {
          _loggedIn = true;
          success();
          $rootScope.$emit('$loginChanged');
        };
        if (typeof Slacker !== 'undefined') {
          Slacker.authenticate(wrapSuccess);
        } else {
          console.error('Slacker doesn\'t actually exist!');
          wrapSuccess();
        }
      },

      // Get current login state
      loggedIn: function () {
        return _loggedIn;
      },

      // return the current channels we have
      getChannels: function() {
        return _channels;
      },

      // refresh the channels
      getChannelList: function(success, failure, excludeArchives) {
        // remember the channels if we succeed
        var _success = function(channels) {
          console.log('Successfully retrieved ' + channels.length + ' channels!');
          _channels = channels;
          success(channels);
        };

        _retrieveChannels(_success, failure, 0);
      },

      // retriving a single channel (must have been refreshed already)
      getChannel: function(channelId) {
        for (key in _channels) {
          if (_channels[key].id == channelId)
            return _channels[key];
        }

        return null;
      },

      // sets the channel (used in posting a message);
      setChannel: function(channelId) {
        _channel = _channels.find(function(el, index, arr) {
          return el.id == channelId;
        });
      },

      // posting a message
      postMessage: function(success, failure, message, channel) {
        // handle no Slacker...
        if (typeof Slacker === 'undefined') {
          console.log('Slacker plugin not available, running on platform without plugin - echoing back');
          success(message);
        }
        else {
          Slacker.postMessage(success, failure, message, channel);
        }
      }
    }
  });
