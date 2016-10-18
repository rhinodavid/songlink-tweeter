const expect = require('chai').expect;
const Tweet = require('../db/db').Tweet;
const enqueueTweet = require('../helpers/streamHelpers').enqueueTweet;
const validSpotifyUrl = require('../helpers/streamHelpers').validSpotifyUrl;

describe('Queueing tweets', () => {

  afterEach((done) => {
    // destory tweets made during tests
    Tweet.destroy(
      {
        where: {
          id_str: { // eslint-disable-line
            $or: ['788169506648645632', '788166670640680961']
          } 
        }
      }
    )
    .then(() => {
      done();
    });
  });

  it ('Should not queue tweets with valid Spotify URLs', function(done) {
    /* eslint-disable */
    const tweet =
      {
        created_at: 'Mon Oct 17 23:55:52 +0000 2016',
        id: 788166670640681000,
        id_str: '788166670640680961',
        text: '#NowPlaying Moments by One Direction https://t.co/bazcJgrNuZ',
        source: '<a href="http://twitter.com" rel="nofollow">Twitter Web Client</a>',
        truncated: false,
        in_reply_to_status_id: null,
        in_reply_to_status_id_str: null,
        in_reply_to_user_id: null,
        in_reply_to_user_id_str: null,
        in_reply_to_screen_name: null,
        user:
         { id: 2976571805,
           id_str: '2976571805',
           name: 'saturn.',
           screen_name: 'artsniaIl',
           location: '10/05 14/09 26/09',
           url: null,
           description: 'larry shipper (n.) a person who will always support, protect, and love larry stylinson, under any circumstances.',
           protected: false,
           verified: false,
           followers_count: 835,
           friends_count: 196,
           listed_count: 4,
           favourites_count: 96,
           statuses_count: 295,
           created_at: 'Tue Jan 13 15:09:34 +0000 2015',
           utc_offset: -7200,
           time_zone: 'Mid-Atlantic',
           geo_enabled: false,
           lang: 'pt',
           contributors_enabled: false,
           is_translator: false,
           profile_background_color: '000000',
           profile_background_image_url: 'http://abs.twimg.com/images/themes/theme1/bg.png',
           profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme1/bg.png',
           profile_background_tile: false,
           profile_link_color: '000000',
           profile_sidebar_border_color: '000000',
           profile_sidebar_fill_color: '000000',
           profile_text_color: '000000',
           profile_use_background_image: false,
           profile_image_url: 'http://pbs.twimg.com/profile_images/788029701184946176/yvJ9HPlE_normal.jpg',
           profile_image_url_https: 'https://pbs.twimg.com/profile_images/788029701184946176/yvJ9HPlE_normal.jpg',
           profile_banner_url: 'https://pbs.twimg.com/profile_banners/2976571805/1476497374',
           default_profile: false,
           default_profile_image: false,
           following: null,
           follow_request_sent: null,
           notifications: null },
        geo: null,
        coordinates: null,
        place: null,
        contributors: null,
        is_quote_status: false,
        retweet_count: 0,
        favorite_count: 0,
        entities:
         { hashtags: [],
           urls: [
              {
                url: 'https://t.co/V6MORQnCgF',
                expanded_url: 'https://twitter.com/spotifyuk/status/788001646089428992',
                display_url: 'twitter.com/spotifyuk/stat…',
                indices: [ 22, 45 ]
              }
            ],
           user_mentions: [],
           symbols: [] },
        favorited: false,
        retweeted: false,
        possibly_sensitive: false,
        filter_level: 'low',
        lang: 'en',
        timestamp_ms: '1476748552366'
      };
    /* eslint-enable */
    enqueueTweet(tweet)
    .then(() => {
      Tweet.findAll({where: {
        id_str: '788166670640680961' // eslint-disable-line
      }})
      .then(tweets => {
        expect(tweets.length).to.equal(0);
        done();
      });
    });
  });

  it ('Should queue tweets with valid Spotify URLs', function(done) {
    /* eslint-disable */
    const tweet =
      { 
        created_at: 'Tue Oct 18 00:07:08 +0000 2016',
        id: 788169506648645600,
        id_str: '788169506648645632',
        text: '#NowPlaying 24K Magic by Bruno Mars  https://t.co/xYqw59c5SN',
        source: '<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>',
        truncated: false,
        in_reply_to_status_id: null,
        in_reply_to_status_id_str: null,
        in_reply_to_user_id: null,
        in_reply_to_user_id_str: null,
        in_reply_to_screen_name: null,
        user:
         { id: 370379767,
           id_str: '370379767',
           name: 'Jamie E.',
           screen_name: 'fjpendergast',
           location: 'Hoover, AL',
           url: null,
           description: 'Commercial Real Estate-Birmingham. Carpedium. Fanatic of family, cheeseburgers & the Braves. Experience is simply the name we give our mistakes.-Oscar W.',
           protected: false,
           verified: false,
           followers_count: 75,
           friends_count: 198,
           listed_count: 2,
           favourites_count: 26,
           statuses_count: 392,
           created_at: 'Thu Sep 08 22:49:37 +0000 2011',
           utc_offset: null,
           time_zone: null,
           geo_enabled: false,
           lang: 'en',
           contributors_enabled: false,
           is_translator: false,
           profile_background_color: 'C0DEED',
           profile_background_image_url: 'http://abs.twimg.com/images/themes/theme1/bg.png',
           profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme1/bg.png',
           profile_background_tile: false,
           profile_link_color: '0084B4',
           profile_sidebar_border_color: 'C0DEED',
           profile_sidebar_fill_color: 'DDEEF6',
           profile_text_color: '333333',
           profile_use_background_image: true,
           profile_image_url: 'http://pbs.twimg.com/profile_images/1794512542/image_normal.jpg',
           profile_image_url_https: 'https://pbs.twimg.com/profile_images/1794512542/image_normal.jpg',
           default_profile: true,
           default_profile_image: false,
           following: null,
           follow_request_sent: null,
           notifications: null },
        geo: null,
        coordinates: null,
        place: null,
        contributors: null,
        is_quote_status: false,
        retweet_count: 0,
        favorite_count: 0,
        entities:
         { hashtags: [],
           urls: [
              {
                url: 'https://t.co/Haz8KwO3J4',
                expanded_url: 'https://open.spotify.com/track/20Qg2T8o4dobtSmyqxmx5n',
                display_url: 'open.spotify.com/track/20Qg2T8o…',
                indices: [ 40, 63 ]
              }
            ],
           user_mentions: [],
           symbols: [] },
        favorited: false,
        retweeted: false,
        possibly_sensitive: false,
        filter_level: 'low',
        lang: 'en',
        timestamp_ms: '1476748552366'
      };
    /* eslint-enable */
    enqueueTweet(tweet)
    .then(() => {
      Tweet.findAll({where: {
        id_str: '788169506648645632' // eslint-disable-line
      }})
      .then(tweets => {
        expect(tweets.length).to.equal(1);
        done();
      });
    });

  });
});

describe('validSpotifyUrl', function() {
  it('should return false for invalid URLs', function() {
    const url = 'https://twitter.com/spotifyuk/status/788001646089428992';
    expect(validSpotifyUrl(url)).to.equal(false);
  });
  it('should return true for valid URLs', function() {
    const url = 'https://open.spotify.com/track/20Qg2T8o4dobtSmyqxmx5n';
    expect(validSpotifyUrl(url)).to.equal(true);
  });
});