const Twit = require('twit');
const winston = require('winston');
require('dotenv').load();

winston.add(
  winston.transports.File, {
    filename: 'stream.log',
    level: 'info',
    json: false,
    eol: 'n',
    timestamp: true
  }
);

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
  console.log('Connected to statuses stream');
});

stream.on('tweet', tweet => {
  if (tweet.retweeted_status === undefined) {

    tweetCount++;

    console.log('TWEET ID: ', tweet.id_str);
    console.log(tweet.text);
    console.log(tweet.entities.urls);
    console.log('Tweet rate (T/M):', tweetCount / ((Date.now() - startTime) / 60000));
    console.log('\n\n\n');
  }
});

stream.on('error', error => {
  winston.log('error', 'Stream error:');
  winston.log('error', 'Message:', error.message);
  winston.log('error', 'Status code:', error.statusCode);
  console.log('Stream error. See logs');
});

stream.on('disconnect', disconnectMessage => {
  console.log('Disconnected with message:', disconnectMessage);
});

stream.on('limit', function (limitMessage) {
  winston.log('error', 'Rate limited with message:', limitMessage);
  console.log('Rate limited with message:', limitMessage);
});
