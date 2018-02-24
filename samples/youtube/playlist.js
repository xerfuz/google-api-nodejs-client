// Copyright 2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const {google} = require('googleapis');
const sampleClient = require('../sampleclient');

// initialize the Youtube API library
const youtube = google.youtube({
  version: 'v3',
  auth: sampleClient.oAuth2Client
});

// a very simple example of getting data from a playlist
function runSamples () {
  // the first query will return data with an etag
  getPlaylistData(null, (err, res) => {
    if (err) {
      throw err;
    }
    const etag = res.data.etag;
    console.log(`etag: ${etag}`);

    // the second query will (likely) return no data, and an HTTP 304
    // since the If-None-Match header was set with a matching eTag
    getPlaylistData(etag, (err, res) => {
      if (err) {
        throw err;
      }
      console.log(res.status);
    });
  });
}

function getPlaylistData (etag, callback) {
  // Create custom HTTP headers for the request to enable
  // use of eTags
  const headers = {};
  if (etag) {
    headers['If-None-Match'] = etag;
  }
  youtube.playlists.list({
    part: 'id,snippet',
    id: 'PLIivdWyY5sqIij_cgINUHZDMnGjVx3rxi',
    headers: headers
  }, (err, res) => {
    if (err) {
      throw err;
    }
    if (res) {
      console.log('Status code: ' + res.status);
    }
    console.log(res.data);
    callback(err, res);
  });
}

const scopes = [
  'https://www.googleapis.com/auth/youtube'
];

sampleClient.authenticate(scopes, err => {
  if (err) {
    throw err;
  }
  runSamples();
});
