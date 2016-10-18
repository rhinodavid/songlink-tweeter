const T = require('./twitter/twitterConnection');
const winston = require('./util/logger.js');
const getQueuedTweetsAndEmptyQueue = require('./helpers/dbHelpers').getQueuedTweetsAndEmptyQueue;
const postResponseTweet = require('./helpers/apiHelpers').postResponseTweet;

const getQueuedTweetsAndRespond = function() {
  getQueuedTweetsAndEmptyQueue()
  .then(tweets => {
    tweets.forEach(tweet => {
      postResponseTweet(tweet);
    });
  });
};

module.exports = getQueuedTweetsAndRespond;
