const expect = require('chai').expect;
const nock = require('nock');

const postResponse = require('../tweeter').postResponse;

nock.cleanAll();

const tweet = {
  'id_str': '788437701145931776',
  'song_url': 'https://open.spotify.com/track/6DxT6qWd8P7ZOP5p4urTfv',
  'username': 'SonglinkTweeter'
};

describe('postResponse', () => {
  before(() => {
    nock('http://www.songl.ink')
      .post('/create', {
        'source': 'spotify',
        'source_id': '6DxT6qWd8P7ZOP5p4urTfv'
      })
      .reply(200,
      { 'album_art': 'https://i.scdn.co/image/2827b69af4241341824c302c827922c4554c07c5',
        'album_title': 'Northern Lights',
        'artist': 'Zeds Dead',
        'share_link': 'http://songl.ink/27b7f',
        'source': 'spotify',
        'source_id': '6DxT6qWd8P7ZOP5p4urTfv',
        'title': 'Stardust' }
      );

    nock('https://api.twitter.com/1.1/statuses')
      .post('/update.json')
      .query({
        'in_reply_to_status_id': tweet.id_str,
        'status': `@${ tweet.username } share this track with all your friends with Songlink http://songl.ink/27b7f`
      })
      .reply(201, /* eslint-disable */
        { created_at: 'Tue Oct 18 19:28:13 +0000 2016',
          id: 788461701691691000,
          id_str: '788461701691691009',
          text: '@SonglinkTweeter share this track with all your friends with Songlink https://t.co/GmVmfnMmd1',
          truncated: false,
          entities:
           { hashtags: [],
             symbols: [],
             user_mentions: [ [Object] ],
             urls: [ [Object] ] },
          source: '<a href="http://github.com/rhinodavid/songlink-tweeter" rel="nofollow">Songlink Tweeter</a>',
          in_reply_to_status_id: 788437701145931800,
          in_reply_to_status_id_str: '788437701145931776',
          in_reply_to_user_id: 788082102868639700,
          in_reply_to_user_id_str: '788082102868639744',
          in_reply_to_screen_name: 'SonglinkTweeter',
          user:
           { id: 788082102868639700,
             id_str: '788082102868639744',
             name: 'Songlink Tweeter',
             screen_name: 'SonglinkTweeter',
             location: '',
             description: '',
             url: null,
             entities: { description: [Object] },
             protected: false,
             followers_count: 0,
             friends_count: 0,
             listed_count: 0,
             created_at: 'Mon Oct 17 18:19:50 +0000 2016',
             favourites_count: 0,
             utc_offset: -25200,
             time_zone: 'Pacific Time (US & Canada)',
             geo_enabled: false,
             verified: false,
             statuses_count: 3,
             lang: 'en',
             contributors_enabled: false,
             is_translator: false,
             is_translation_enabled: false,
             profile_background_color: 'F5F8FA',
             profile_background_image_url: null,
             profile_background_image_url_https: null,
             profile_background_tile: false,
             profile_image_url: 'http://abs.twimg.com/sticky/default_profile_images/default_profile_4_normal.png',
             profile_image_url_https: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_4_normal.png',
             profile_link_color: '2B7BB9',
             profile_sidebar_border_color: 'C0DEED',
             profile_sidebar_fill_color: 'DDEEF6',
             profile_text_color: '333333',
             profile_use_background_image: true,
             has_extended_profile: false,
             default_profile: true,
             default_profile_image: true,
             following: false,
             follow_request_sent: false,
             notifications: false },
          geo: null,
          coordinates: null,
          place: null,
          contributors: null,
          is_quote_status: false,
          retweet_count: 0,
          favorite_count: 0,
          favorited: false,
          retweeted: false,
          possibly_sensitive: false,
          lang: 'en' } /* eslint-enable */
      );

  });
  after(() => {
    nock.restore();
  });

  it ('should post a response to a tweet', (done) => {
    postResponse(tweet)
    .then(data => {
      expect(data.created_at).to.exist;
      done();
    })
    .catch(error => {
      expect(error).to.not.exist;
      done();
    });
  });
});
