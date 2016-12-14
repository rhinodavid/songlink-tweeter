const dbHelpers = require('./helpers/dbHelpers');
const logger = require('./util/logger.js');
const postResponseTweet = require('./helpers/apiHelpers').postResponseTweet;

const getQueuedTweetsAndRespond = function getQueuedTweetsAndRespond() {
  return Promise.all([
    dbHelpers.getVerifiedTweets(),
    dbHelpers.getTweetsFromPopularUsers(),
  ])
  .then(([verifiedTweets, popularTweets]) => {
    if (verifiedTweets.length) {
      // tweet back to a verified user
      return postResponseTweet(verifiedTweets[Math.floor(Math.random() * verifiedTweets.length)]);
    } else if (popularTweets.length) {
      // tweet to the most followed user
      return postResponseTweet(popularTweets[0]);
    }
    return null;
  })
  // eslint-disable-next-line no-confusing-arrow
  .then(responseData => responseData ? logger.info('Successfully tweeted') : null)
  .then(() => dbHelpers.emptyTweetQueue())
  .catch((error) => {
    dbHelpers.emptyTweetQueue();
    logger.error('Error with tweeter worker', error);
  });
};

module.exports = getQueuedTweetsAndRespond;
