const expect = require('chai').expect;
const Tweet = require('../db/db').Tweet;
const getSpotifyId = require('../helpers/tweeterHelpers').getSpotifyId;
const getSonglinkForSpotify = require('../helpers/tweeterHelpers').getSonglinkForSpotify;
const nock = require('nock');

nock.cleanAll();

describe ('getSpotifyId', () => {
  it('should return the id from a Spotify url', () => {
    const url = 'https://open.spotify.com/track/20Qg2T8o4dobtSmyqxmx5n';
    expect(getSpotifyId(url)).to.equal('20Qg2T8o4dobtSmyqxmx5n');
  });
});

describe('getSonglinkForSpotify', () => {

  before(() => {
    nock('http://www.songl.ink')
      .post('/create', {
        'source': 'spotify',
        'source_id': '20Qg2T8o4dobtSmyqxmx5n'
      })
      .reply(200, {
        'album_art': 'https://i.scdn.co/image/d7e269f8d44be624f332e640a771c3041dc1d782',
        'album_title': 'I Missing You',
        'artist': 'Saibot',
        'share_link': 'http://songl.ink/2aa10',
        'source': 'spotify',
        'source_id': '20Qg2T8o4dobtSmyqxmx5n',
        'title': 'I Missing You'
      });
  });

  after(() => {
    nock.restore();
  });
  
  it('should return songlink', (done) => {
    const id = '20Qg2T8o4dobtSmyqxmx5n';
    getSonglinkForSpotify(id)
      .then(songlink => {
        expect(/http:\/\/songl\.ink\/\w{3,8}/.test(songlink.share_link)).to.equal(true);
        done();
      })
      .catch(error => {
        throw new Error(error);
        done();
      });
  });
});
