const enqueueTweet = require('./helpers/dbHelpers').enqueueTweet;
const T = require('./twitter/twitterConnection');
const winston = require('./util/logger.js');

const stream = T.stream('statuses/filter', {
  track: ['open spotify com track'],
  language: 'en'
});

stream.on('connected', response => {
  winston.log('info', 'Connected to statuses stream');
});

stream.on('tweet', tweet => {
  enqueueTweet(tweet);
});

stream.on('error', error => {
  winston.log('error', 'Stream error:');
  winston.log('error', 'Message:', error.message);
  winston.log('error', 'Status code:', error.statusCode);
});

stream.on('disconnect', disconnectMessage => {
  winston.log('info', 'Disconnected with message:', disconnectMessage);
});

stream.on('limit', function (limitMessage) {
  winston.log('error', 'Rate limited with message:', limitMessage);
});

module.exports = stream;
