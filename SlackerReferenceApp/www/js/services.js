angular.module('slacker.services', [])
  
  // everything we could need from our Slacker servie
  .factory('SlackerService', function() {
    /*
     * private state variables
     */
    // the list of channels
    var _channels = [];
    var _currentChannel = null;
    var _NUM_CHANNEL_RETRIES = 6;
    var _CHANNEL_RETRY_DELAY = 500;

    // helper to retrieve the channels - handles the case where the plugin isn't available
    var _retrieveChannels = function(success, failure, num) {
      // give up after a bit and return defaults (i.e. no slacker exists)
      if (num >= _NUM_CHANNEL_RETRIES) {
        _success([{name:'Channel1', id:'1'}, {name:'Channel2', id:'2'}, {name:'Channel3', id:'3'}]);
      }
      // make sure we have Slacker, and if not, wait a bit
      else if (typeof Slacker === 'undefined' || typeof Slacker.getChannelList === 'undefined') {
        console.log('Slacker not ready, waiting 500ms');
        setTimeout(retrieveChannels, _CHANNEL_RETRY_DELAY, success, failure, ++num);
      }
      // now we ge to actually make the call to the plugin
      else {
        Slacker.getChannelList(success, failure, true);
      }
    }

    /*
     * what we actually expose to the controllers
     */
    return {
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
        }

        _retrieveChannels(_success, failure, 0);
      },

      // retriving a single channel (must have been refreshed already)
      getChannel: function(channelID) {
        return _channels.find(function(el, index, arr) {
          return el.id == channelID;
        });
      },

      // sets the channel (used in posting a message);
      setChannel: function(channelID) { 
        _channel = _channels.find(function(el, index, arr) {
          return el.id == channelID;
        });
      },

      // posting a message - TODO deal with a specific channel
      postMessage: function(success, failure, message) {
        // handle no Slacker...
        if (typeof Slacker === 'undefined') {
          console.log('Slacker plugin not available, running on platform without plugin - echoing back');
          success(message);
        }
        else {
          Slacker.postMessage(success, failure, message);
        }
      }
    }
  });
