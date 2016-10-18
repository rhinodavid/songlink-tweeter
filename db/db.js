const Sequelize = require('sequelize');
const db = new Sequelize('sltweeter', 'user', null,
  {
    dialect: 'sqlite',
    storage: './db/sltweeter.sqlite',
    logging: false
  });


const Tweet = db.define('Tweet', {
  id_str: { // eslint-disable-line
    type: Sequelize.STRING,
    primaryKey: true
  },
  song_url: Sequelize.STRING, // eslint-disable-line
  username: Sequelize.STRING
});

Tweet.sync();

module.exports = {
  Tweet
};
