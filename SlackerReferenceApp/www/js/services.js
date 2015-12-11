angular.module('slacker.services', [])
  
  // everything we could need from our Slacker servie
  .factory('SlackerService', function() {
    /*
     * private state variables
     */
    // the list of channels
    var _channels = [];
    var _channels_cb = null;
    var _NUM_CHANNEL_RETRIES = 6;
    var _CHANNEL_RETRY_DELAY = 500;

    /*
     * helper functions that are used - for the channel refreshing
     */
    // success callback - if we got channels, pass back to "cb" callback
    var _success = function(channels) {
      console.log('getChannelList success callback fired');
      // we got some!
      if (channels && channels.length) {
        console.log('Successfully retrieved ' + channels.length + ' channels!');
        _channels = channels;
        _channels_cb(channels);
      }
      // we failed somewhere, return no channels so as not to break anything
      else
        _channels_cb([]);
    }

    // failure callback - just pass back the failed message
    var _failure = function(message) {
      console.log('error calling getChannelList: ' + message);
      _channels_cb(message);
    }

    // helper to retrieve the channels - handles the case where the plugin isn't available
    var _retrieveChannels = function(num) {
      // give up after a bit and return defaults (i.e. no slacker exists)
      if (num >= _NUM_CHANNEL_RETRIES) {
        _success([{name:'Channel1', id:'1'}, {name:'Channel2', id:'2'}, {name:'Channel3', id:'3'}]);
      }
      // make sure we have Slacker, and if not, wait a bit
      else if (typeof Slacker === 'undefined' || typeof Slacker.getChannelList === 'undefined') {
        console.log('Slacker not ready, waiting 500ms');
        setTimeout(retrieveChannels, _CHANNEL_RETRY_DELAY, ++num);
      }
      // now we ge to actually make the call to the plugin
      else {
        Slacker.getChannelList(_success, _failure, true);
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

      refreshChannels: function(cb) {
        // remember our callback
        _channels_cb = cb;
        _retrieveChannels(0);
      },

      getChannel: function(channelID) {
        return _channels.find(function(el, index, arr) {
          return el.id == channelID;
        });
      }

      /* legacy functions not implemented
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
      */
    }
  });
