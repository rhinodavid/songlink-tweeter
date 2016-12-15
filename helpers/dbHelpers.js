const Tweet = require('../db/db').Tweet;

const validSpotifyUrl = function validSpotifyUrl(url) {
  return /^https:\/\/open\.spotify\.com\/track\/\w+$/.test(url);
};

const enqueueTweet = function enqueueTweet(tweet) {
  if (tweet.retweeted_status) {
    // only enqueue tweets that are not retweets
    return new Promise(resolve => resolve(null));
  }
  // check each URL to see if there is a valid spotify link
  const foundSpotifyUrlIndex = tweet.entities.urls.reduce((foundIndex, url, index) => {
    if (validSpotifyUrl(url.expanded_url)) {
      return index;
    }
    return foundIndex;
  }, -1);

  if (foundSpotifyUrlIndex > -1) {
    // found a valid spotify URL in the tweet -- enqueue it
    return Tweet.upsert({
      id_str: tweet.id_str, // eslint-disable-line
      song_url: tweet.entities.urls[foundSpotifyUrlIndex].expanded_url, // eslint-disable-line
      username: tweet.user.screen_name,
      user_verified: tweet.user.verified,
      user_followers_count: tweet.user.followers_count,
    });
  }

  return new Promise(resolve => resolve(null));
};

const getQueuedTweetsAndEmptyQueue = () => {
  return new Promise((resolve, reject) => {
    Tweet.findAll({})
      .then((tweets) => {
        Tweet.destroy({ where: {} })
        .then(() => {
          resolve(tweets);
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getVerifiedTweets = () =>
  Tweet.findAll({
    where: {
      user_verified: true,
    },
  });

const getTweetsFromPopularUsers = () =>
  Tweet.findAll({
    limit: 5,
    order: '`user_followers_count` DESC',
  });

const emptyTweetQueue = () =>
  Tweet.destroy({ where: {} });

module.exports = {
  enqueueTweet,
  getQueuedTweetsAndEmptyQueue,
  emptyTweetQueue,
  getVerifiedTweets,
  getTweetsFromPopularUsers,
};
