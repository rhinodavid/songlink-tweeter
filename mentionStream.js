const T = require('./twitter/twitterConnection');
const winston = require('./util/logger.js');
const getMentions = require('./helpers/apiHelpers').getMentions;
const getLatestMentions = require('./helpers/apiHelpers').getLatestMentions;

const respondToMentions = () => {
  getLatestMentions()
  .then(tweets => {
    console.log(tweets);
  });
};

const handleMention = tweet => {
  // check for RT
  if (tweet.retweeted_status) {
    return;
  }

  const mentionTweetData = {};
  mentionTweetData.username = tweet.user.screen_name;
  mentionTweetData.user_id_str = tweet.user.id_str; // eslint-disable-line
  mentionTweetData.tweet_id_str = tweet.id_str; // eslint-disable-line

  const ignoreRegexs = [
    /\bstop\b/ig,
    /🖕/ig
  ];

  const unignoreRegex = /i want you back/ig;

  if (ignoreRegexs[0].test(tweet.text) || ignoreRegexs[1].test(tweet.text)) {
    // this user wants us to ignore them
    return;
  }

  if (unignoreRegex.test(tweet.text)) {
    // this user wants us to un-ignore them
    return;
  }

};

respondToMentions();
//module.exports = stream;
