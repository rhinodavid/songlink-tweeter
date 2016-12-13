const Sequelize = require('sequelize');

const db = new Sequelize('sltweeter', 'user', null,
  {
    dialect: 'sqlite',
    storage: './db/sltweeter.sqlite',
    logging: false,
  });


const Tweet = db.define('Tweet', {
  id_str: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  song_url: Sequelize.STRING,
  username: Sequelize.STRING,
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
