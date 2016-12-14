const expect = require('chai').expect;
const nock = require('nock');
const Tweet = require('../db/db').Tweet;
const getSpotifyId = require('../helpers/apiHelpers').getSpotifyId;
const getSonglinkForSpotify = require('../helpers/apiHelpers').getSonglinkForSpotify;
const postResponseTweet = require('../helpers/apiHelpers').postResponseTweet;
const getMentions = require('../helpers/apiHelpers').getMentions;

nock.cleanAll();

describe('getSpotifyId', () => {
  it('should return the id from a Spotify url', () => {
    const url = 'https://open.spotify.com/track/20Qg2T8o4dobtSmyqxmx5n';
    expect(getSpotifyId(url)).to.equal('20Qg2T8o4dobtSmyqxmx5n');
  });
});

describe('getSonglinkForSpotify', () => {

  before(() => {
    nock('http://www.songl.ink')
      .post('/create', {
        source: 'spotify',
        source_id: '20Qg2T8o4dobtSmyqxmx5n',
      })
      .reply(200, {
        album_art: 'https://i.scdn.co/image/d7e269f8d44be624f332e640a771c3041dc1d782',
        album_title: 'I Missing You',
        artist: 'Saibot',
        share_link: 'http://songl.ink/2aa10',
        source: 'spotify',
        source_id: '20Qg2T8o4dobtSmyqxmx5n',
        title: 'I Missing You',
      });
  });

  it('should return songlink', (done) => {
    const id = '20Qg2T8o4dobtSmyqxmx5n';
    getSonglinkForSpotify(id)
      .then((songlink) => {
        expect(/http:\/\/songl\.ink\/\w{3,8}/.test(songlink.share_link)).to.equal(true);
        done();
      })
      .catch((error) => {
        throw new Error(error);
      });
  });
});

const tweet = Tweet.build({
  id_str: '788437701145931776',
  song_url: 'https://open.spotify.com/track/6DxT6qWd8P7ZOP5p4urTfv',
  username: 'SonglinkTweeter',
});

describe('postResponseTweet', () => {
  beforeEach(() => {
    nock('http://www.songl.ink')
      .post('/create', {
        source: 'spotify',
        source_id: '6DxT6qWd8P7ZOP5p4urTfv',
      })
      .reply(200,
      { album_art: 'https://i.scdn.co/image/2827b69af4241341824c302c827922c4554c07c5',
        album_title: 'Northern Lights',
        artist: 'Zeds Dead',
        share_link: 'http://songl.ink/27b7f',
        source: 'spotify',
        source_id: '6DxT6qWd8P7ZOP5p4urTfv',
        title: 'Stardust' }
      );
    nock('https://api.twitter.com/1.1')
      .post('/statuses/update.json')
      .query({
        in_reply_to_status_id: tweet.id_str,
        status: `@${tweet.username} share this track with all your friends with Songlink http://songl.ink/27b7f`
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
  afterEach(() => {
    nock.restore();
  });

  it('should post a response to a tweet', (done) => {
    postResponseTweet(tweet)
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

xdescribe('getMentions', () => {
  beforeEach(() => {
    console.log('creating nock');
    nock('https://api.twitter.com')
      .get('1.1/statuses/mentions_timeline.json')
      .reply(200, /* eslint-disable */
        [ { created_at: 'Tue Oct 18 23:42:11 +0000 2016',
            id: 788525617566199800,
            id_str: '788525617566199808',
            text: '@SonglinkTweeter 🖕🏽🖕🏿🖕🏻',
            truncated: false,
            entities: { hashtags: [], symbols: [], user_mentions: [
              { screen_name: 'SonglinkTweeter',
                  name: 'Songlink Tweeter',
                  id: 788082102868639700,
                  id_str: '788082102868639744',
                  indices: [ 0, 16 ] }
            ], urls: [] },
            source: '<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>',
            in_reply_to_status_id: null,
            in_reply_to_status_id_str: null,
            in_reply_to_user_id: 788082102868639700,
            in_reply_to_user_id_str: '788082102868639744',
            in_reply_to_screen_name: 'SonglinkTweeter',
            user:
             { id: 108857215,
               id_str: '108857215',
               name: 'David',
               screen_name: 'RhinoDavid',
               location: 'The Beach',
               description: 'happy life with the machines',
               url: null,
               // entities: [Object],
               protected: false,
               followers_count: 110,
               friends_count: 264,
               listed_count: 4,
               created_at: 'Wed Jan 27 06:27:37 +0000 2010',
               favourites_count: 2467,
               utc_offset: null,
               time_zone: null,
               geo_enabled: false,
               verified: false,
               statuses_count: 1534,
               lang: 'en',
               contributors_enabled: false,
               is_translator: false,
               is_translation_enabled: false,
               profile_background_color: '022330',
               profile_background_image_url: 'http://abs.twimg.com/images/themes/theme15/bg.png',
               profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme15/bg.png',
               profile_background_tile: false,
               profile_image_url: 'http://pbs.twimg.com/profile_images/632022523216052224/_gE9xfoh_normal.jpg',
               profile_image_url_https: 'https://pbs.twimg.com/profile_images/632022523216052224/_gE9xfoh_normal.jpg',
               profile_link_color: '0084B4',
               profile_sidebar_border_color: 'A8C7F7',
               profile_sidebar_fill_color: 'C0DFEC',
               profile_text_color: '333333',
               profile_use_background_image: true,
               has_extended_profile: false,
               default_profile: false,
               default_profile_image: false,
               following: false,
               follow_request_sent: false,
               notifications: false,
               translator_type: 'none' },
            geo: null,
            coordinates: null,
            place: null,
            contributors: null,
            is_quote_status: false,
            retweet_count: 0,
            favorite_count: 0,
            favorited: false,
            retweeted: false,
            lang: 'und' } ]
      );
      /* eslint-enable */
  });

  afterEach(() => {
    nock.restore();
  });

  it('should get mentions', (done) => {
    getMentions()
      .then((tweets) => {
        expect(tweets).to.be.an('array');
        expect(tweets.length).to.be(1);
        done();
      });
  });
});
