const expect = require('chai').expect;
const Tweet = require('../db/db').Tweet;
const getSpotifyId = require('../helpers/tweeterHelpers').getSpotifyId;
const getSonglinkForSpotify = require('../helpers/tweeterHelpers').getSonglinkForSpotify;

describe ('getSpotifyId', () => {
  it('should return the id from a Spotify url', () => {
    const url = 'https://open.spotify.com/track/20Qg2T8o4dobtSmyqxmx5n';
    expect(getSpotifyId(url)).to.equal('20Qg2T8o4dobtSmyqxmx5n');
  });
});

describe('getSonglinkForSpotify', () => {
  
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
