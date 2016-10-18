const request = require('request');
const winston = require('../util/logger');
const T = require('../twitter/twitterConnection');

const getSpotifyId = url => {
  return url.match(/^https:\/\/open\.spotify\.com\/track\/(\w+)$/)[1];
};

const getSonglinkForSpotify = spotifyId => {
  return new Promise((resolve, reject) => {
    const songlinkRequst = request({
      method: 'POST',
      url: 'http://www.songl.ink/create',
      headers: {
        contentType: 'application/json'
      },
      json: true,
      body: {
        source: 'spotify',
        'source_id': spotifyId
      }
    }, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
};

const postResponseTweet = tweet => {
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
  getSpotifyId,
  getSonglinkForSpotify,
  postResponseTweet
};
