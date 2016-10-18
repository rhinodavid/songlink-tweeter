const Twit = require('twit');
const winston = require('winston');
require('dotenv').load();

const enqueueTweet = require('./streamHelpers').enqueueTweet;

winston.add(
  winston.transports.File, {
    filename: 'stream.log',
    level: 'info',
    json: false,
    eol: '\n',
    timestamp: true
  }
);

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {timestamp: true});

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY, // eslint-disable-line
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET, // eslint-disable-line
  access_token: process.env.TWITTER_ACCESS_TOKEN, // eslint-disable-line
  access_token_secret: process.env.TWITTER_TOKEN_SECRET // eslint-disable-line
});



const startTime = Date.now();
let tweetCount = 0;

const stream = T.stream('statuses/filter', {
  track: ['open spotify com track'],
  // filter_level: 'low', //eslint-disable-line
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
