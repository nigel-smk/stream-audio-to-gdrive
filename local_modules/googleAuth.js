var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var credentials = require('../credentials/apiKey.json');
//TODO get client_id and secret from credentials

var oauth2Client = new OAuth2(credentials.web.client_id, credentials.web.client_secret, credentials.web.redirect_uris[0]);


function generateAuthUrl() {
    return oauth2Client.generateAuthUrl({
        scope: "https://www.googleapis.com/auth/drive.file"
    });
}

function getToken(code) {
    oauth2Client.getToken(code, function(err, tokens) {
        // Now tokens contains an access_token and an optional refresh_token. Save them.
        if(!err) {
            oauth2Client.setCredentials(tokens);
        }
    });
}

function getOauth2Client() {
    return oauth2Client;
}

module.exports = {
    generateAuthUrl: generateAuthUrl,
    getToken: getToken,
    getOauth2Client: getOauth2Client
}