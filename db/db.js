const Sequelize = require('sequelize');
const path = require('path');

const db = new Sequelize('sltweeter', 'user', null,
  {
    dialect: 'sqlite',
    storage: path.join(__dirname, 'sltweeter.sqlite'),
    logging: false,
  });


const Tweet = db.define('Tweet', {
  id_str: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  song_url: Sequelize.STRING,
  username: Sequelize.STRING,
  user_followers_count: Sequelize.INTEGER,
  user_verified: Sequelize.BOOLEAN,
});

const ConfigItem = db.define('ConfigItem', {
  key: Sequelize.STRING,
  value: Sequelize.STRING,
});

const IgnoredUser = db.define('IgnoredUser', {
  id_str: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  username: Sequelize.STRING,
  tweet_id_str: Sequelize.STRING,
});

Tweet.sync();
ConfigItem.sync();
IgnoredUser.sync();

module.exports = {
  Tweet,
  ConfigItem,
  IgnoredUser,
};
