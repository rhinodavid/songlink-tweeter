const getQueuedTweetsAndEmptyQueue = require('./helpers/dbHelpers').getQueuedTweetsAndEmptyQueue;
const postResponseTweet = require('./helpers/apiHelpers').postResponseTweet;

const getQueuedTweetsAndRespond = function getQueuedTweetsAndRespond() {
  getQueuedTweetsAndEmptyQueue()
  .then((tweets) => {
    tweets.forEach((tweet) => {
      postResponseTweet(tweet);
    });
  });
};

module.exports = getQueuedTweetsAndRespond;
