const request = require('request');

const getSpotifyId = url => {
  return url.match(/^https:\/\/open\.spotify\.com\/track\/(\w+)$/)[1];
};

const getSonglinkForSpotify = spotifyId => {
  return new Promise((resolve, reject) => {
    const songlinkRequst = request({
      method: 'POST',
      url: 'http://www.songl.ink/create',
      headers: {
        contentType: 'application/json'
      },
      json: true,
      body: {
        source: 'spotify',
        'source_id': spotifyId
      }
    }, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
};

module.exports = {
  getSpotifyId,
  getSonglinkForSpotify
};
