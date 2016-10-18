const T = require('./twitter/twitterConnection');
const winston = require('./util/logger.js');
const getSonglinkForSpotify = require('./helpers/tweeterHelpers').getSonglinkForSpotify;
const getSpotifyId = require('./helpers/tweeterHelpers').getSpotifyId;

const postResponse = tweet => {
  getSonglinkForSpotify(getSpotifyId(tweet.song_url))
  .then(songlink => {
    const songlinkUrl = songlink.share_link;
    // take songlink Url and make a tweet out of it
  })
  .catch(err => {
    winston.log('error', 'Error getting Songlink data\n', err);
  });
};
