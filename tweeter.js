const T = require('./twitter/twitterConnection');
const winston = require('./util/logger.js');
const getSonglinkForSpotify = require('./helpers/tweeterHelpers').getSonglinkForSpotify;
const getSpotifyId = require('./helpers/tweeterHelpers').getSpotifyId;

const postResponse = tweet => {
  return new Promise((resolve, reject) => {
    getSonglinkForSpotify(getSpotifyId(tweet.song_url))
      .then(songlink => {
        const songlinkUrl = songlink.share_link;
        const replyTweet = {
          'in_reply_to_status_id': tweet.id_str,
          'status': `@${ tweet.username } share this track with all your friends with Songlink ${ songlinkUrl }`
        };
        T.post('statuses/update', replyTweet, (error, data, response) => {
          if (error) {
            winston.log('error', 'Error posting reply tweet');
            winston.log('error', 'Tweet:', tweet);
            winston.log('error', 'Twitter error:', error);
            reject(error);
          }
          resolve(data);
        });
      })
      .catch(err => {
        winston.log('error', 'Error getting Songlink data\n', err);
        resolve(err);
      });
  });
};

module.exports = {
  postResponse
};
