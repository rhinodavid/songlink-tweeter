const Tweet = require('../db/db').Tweet;

const validSpotifyUrl = function(url) {
  return /^https:\/\/open\.spotify\.com\/track\/\w+$/.test(url);
};

const enqueueTweet = function(tweet) {
  if (tweet.retweeted_status) {
    // only enqueue tweets that are not retweets
    return;
  }
  // check each URL to see if there is a valid spotify link
  const foundSpotifyUrlIndex = tweet.entities.urls.reduce((foundIndex, url, index) => {
    if (validSpotifyUrl(url.expanded_url)) {
      return index;
    }
    return foundIndex;
  }, -1);

  if (foundSpotifyUrlIndex > -1) {
    return Tweet.upsert({
      id_str: tweet.id_str, // eslint-disable-line
      song_url: tweet.entities.urls[foundSpotifyUrlIndex].expanded_url, // eslint-disable-line
      username: tweet.user.screen_name
    });
  } else {
    return new Promise((resolve, reject) => {
      resolve(null);
      reject(null);
    });
  }
};

const getQueuedTweetsAndEmptyQueue = () => {
  return new Promise((resolve, reject) => {
    Tweet.findAll({raw: true})
      .then(tweets => {
        Tweet.destroy({where: {}}).
        then(() => {
          resolve(tweets);
        });
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = {
  enqueueTweet,
  getQueuedTweetsAndEmptyQueue
};
