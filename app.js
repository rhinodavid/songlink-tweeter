// Begin enqueing tweets from the twitter stream
console.log('starting app..');
require('./stream');

const tweeter = require('./tweeter');

// Tweet every 15 minutes, +/- a random time up to two minutes
setInterval(() => {
  setTimeout(tweeter, (Math.random() * 4 * 60 * 1000) - (2 * 60 * 1000));
}, 15 * 60 * 1000);
