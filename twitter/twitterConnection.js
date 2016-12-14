const Twit = require('twit');
const path = require('path');
require('dotenv').load({
  path: path.join(__dirname, '../.env'),
});

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY, // eslint-disable-line
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET, // eslint-disable-line
  access_token: process.env.TWITTER_ACCESS_TOKEN, // eslint-disable-line
  access_token_secret: process.env.TWITTER_TOKEN_SECRET // eslint-disable-line
});

module.exports = T;
