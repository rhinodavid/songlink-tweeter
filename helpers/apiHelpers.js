const request = require('request');
const winston = require('../util/logger');
const ConfigItem = require('../db/db').ConfigItem;
const T = require('../twitter/twitterConnection');

const getSpotifyId = function getSpotifyId(url) {
  return url.match(/^https:\/\/open\.spotify\.com\/track\/(\w+)$/)[1];
};

const getSonglinkForSpotify = function getSonglinkForSpotify(spotifyId) {
  return new Promise((resolve, reject) => {
    request({
      method: 'POST',
      url: 'http://www.songl.ink/create',
      headers: {
        contentType: 'application/json',
      },
      json: true,
      body: {
        source: 'spotify',
        source_id: spotifyId,
      },
    }, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
};

const postResponseTweet = function postResponseTweet(tweet) {
  return new Promise((resolve, reject) => {
    getSonglinkForSpotify(getSpotifyId(tweet.get('song_url')))
      .then((songlink) => {
        const songlinkUrl = songlink.share_link;
        const replyTweet = {
          in_reply_to_status_id: tweet.get('id_str'),
          status: `@${tweet.get('username')} share this track with all your friends with Songlink ${songlinkUrl}`,
        };
        T.post('statuses/update', replyTweet, (error, data, response) => {
          console.log(response.toJSON());
          if (error) {
            winston.log('error', 'Error posting reply tweet');
            winston.log('error', 'Tweet:', tweet);
            winston.log('error', 'Twitter error:', error);
            reject(error);
          } else {
            resolve(data);
          }
        });
      })
      .catch((error) => {
        winston.error('Error getting Songlink data:', error);
        reject(error);
      });
  });
};

const getMentions = function getMentions(sinceId) {
  return new Promise((resolve, reject) => {
    const options = sinceId ? { since_id: sinceId } : {};
    T.get('statuses/mentions_timeline', options, (error, data, response) => {
      if (error) {
        winston.log('error', 'Error getting mentions\n', error);
        reject(error);
      }
      if (data.length) {
        // found mentions, update the last mention id
        const lastIdString = data[data.length - 1].id_str;
        ConfigItem.findOrCreate({
          where: {
            key: 'lastMentionId',
          },
        })
        .then(() => {
          ConfigItem.update(
            {
              value: lastIdString,
            },
            {
              where: {
                key: 'lastMentionId',
              },
            });
        });
      }
      resolve(data);
    });
  });
};

const getLatestMentions = function getLatestMentions() {
  return ConfigItem.findOne({
    where: {
      key: 'lastMentionId',
    },
  })
  .then(configItem => getMentions(configItem.get('value')));
};

module.exports = {
  getSpotifyId,
  getSonglinkForSpotify,
  postResponseTweet,
  getMentions,
  getLatestMentions,
};
