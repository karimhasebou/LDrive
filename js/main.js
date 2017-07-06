const {app, BrowserWindow, ipcMain} = require('electron');
const url = require('url');
const path = require('path');

const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');

const LISTEN_PORT = 9000;
const SCOPES = ['https://www.googleapis.com/auth/drive']
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'access.json';
const CLIENT_SECRET_PATH = "res/client_secret.json"
var oauth2Client;


let win;

function createWindow(){
    win = new BrowserWindow({width: 800, height: 600});
    win.loadURL(url.format({
        pathname: path.join(__dirname, '../main.html'),
        protocol: 'file:',
        slashes: true
    }));
}

app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

function authenticate(){
    var credentials = fs.readFileSync(CLIENT_SECRET_PATH);
    credentials = JSON.parse(credentials).installed;

    var auth = new googleAuth();
    oauth2Client = new auth.OAuth2(credentials.client_id,
                        credentials.client_secret,
                        credentials.redirect_uris[0]);

    if(load_token(oauth2Client)){
        authenticate_complete();
    }else{
        request_token(oauth2Client)
    }
}

function load_token(oauth2Client){
    var result;
    try{
        oauth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
        result = true;
    }catch(err){
        result = false;
    }
    return result;
}

function request_token(oauth2Client){
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    var open = require('open');
    open(authUrl);

    var http = require('http');
    var http_server = http.createServer(function(req,res){
        res.writeHead(200, {'Content-Type': 'text/html'});
        try{
            var url = require('url')
            var parts = url.parse(req.url, true);
            var code = parts.query['code'];

            oauth2Client.getToken(code, function (err, tokens) {
              // Now tokens contains an access_token and an optional refresh_token. Save them.
                if (!err) {
                    oauth2Client.setCredentials(tokens);
                    authenticate_complete();
                    save_token(tokens);
                }else{
                    console.log(err)
                }
            });
            res.end('Authentication successful');
        }catch(err){
            res.end('Authentication Failed');
            console.log(err)
        }
    });
    http_server.listen(LISTEN_PORT, '127.0.0.1');
}

function save_token(token){
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
          throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
}


function authenticate_complete(){
    console.log('auth_complete');
}

app.on('ready', createWindow)

function main(){
  authenticate()
}

main();
