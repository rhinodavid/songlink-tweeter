const enqueueTweet = require('./helpers/dbHelpers').enqueueTweet;
const T = require('./twitter/twitterConnection');
const winston = require('./util/logger.js');

const stream = T.stream('statuses/filter', {
  track: ['open spotify com track'],
  language: 'en',
});

stream.on('connected', () => {
  winston.info('Connected to statuses stream');
});

stream.on('tweet', (tweet) => {
  enqueueTweet(tweet);
});

stream.on('error', (error) => {
  winston.error('Stream error:');
  winston.error('Message:', error.message);
  winston.error('Status code:', error.statusCode);
});

stream.on('disconnect', (disconnectMessage) => {
  winston.info('Disconnected with message:', disconnectMessage);
});

stream.on('limit', (limitMessage) => {
  winston.error('Rate limited with message:', limitMessage);
});

setTimeout(() => {
  winston.info('stopping stream');
  stream.stop();
}, 8000);

module.exports = stream;
