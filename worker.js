const Twit = require('twit');
require('dotenv').load();

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY, // eslint-disable-line
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET, // eslint-disable-line
  access_token: process.env.TWITTER_ACCESS_TOKEN, // eslint-disable-line
  access_token_secret: process.env.TWITTER_TOKEN_SECRET // eslint-disable-line
});

const stream = T.stream('statuses/filter', {track: ['open.spotify.com/track']});

stream.on('connected', response => {
  console.log('Connected to statuses stream');
});

stream.on('tweet', tweet => {

});

// stream.on('error')