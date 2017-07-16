const bluebird = require('bluebird');
const readFile = bluebird.promisify(require('fs').readFile);
const fs = require('fs')
const http = require('http')
const google = require('googleapis');
const googleAuth = require('google-auth-library');

const LISTEN_PORT = 9000;
const SCOPES = ['https://www.googleapis.com/auth/drive']
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'access.json';
const CLIENT_SECRET_PATH = "res/client_secret.json"


exports.getAuth = function(callback) {
    readFile(CLIENT_SECRET_PATH).
    then(JSON.parse, console.error).
    then(buildAuth, console.error).
    then(loadToken, console.error).
    then((data) => {
        callback(null, data)
    }, requestToken).
    catch(function(error) {
        callback(error, null)
    })
    console.log('dunno whats happening in get auth')
}

function buildAuth(credentials) {
    return new Promise(function(resolve, reject) {
        var auth = new googleAuth();
        var oauth2Client = new auth.OAuth2(credentials.installed.client_id,
            credentials.installed.client_secret,
            credentials.installed.redirect_uris[0]);
        resolve(oauth2Client);
    })
}

function loadToken(oauth2Client) {
    return new Promise(function(resolve, reject) {
        fs.readFile(TOKEN_PATH, function(err, data) {
            if (err) {
                reject(oauth2Client)
            } else {
                oauth2Client.setCredentials(JSON.parse(data))
                resolve(oauth2Client)
            }
        });
    });
}

function requestToken(oauth2Client) {
    console.log('requesting token')
    return new Promise(function(resolve, reject) {

        var http_server = http.createServer(function(req, res) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            var url = require('url')
            var parts = url.parse(req.url, true);
            var code = parts.query['code'];

            oauth2Client.getToken(code, function(err, tokens) {
                if (err) {
                    reject(err)
                    console.log('eerror obtaining token')
                } else {
                    console.log('got something for get token response')
                    oauth2Client.setCredentials(tokens);
                    saveToken(tokens)
                    resolve(oauth2Client)
                }
            });
            res.end('Authentication successful');
        });
        console.log('test0')
        http_server.listen(LISTEN_PORT, '127.0.0.1');
        console.log('test1')
        var authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        });
        console.log('test2')
        var open = require('open');
        open(authUrl);
        console.log(authUrl)
        console.log('test3')
    });
}
//
function saveToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
}
