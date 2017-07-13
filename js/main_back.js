const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const url = require('url');
const path = require('path');

const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');

let win;
let oauth2Client;

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

ipcMain.on('authenticate', function(event, arg){
    var auth = require(__dirname+'/auth.js')
    auth.getAuth(function(err, data){
        if(err){
            console.log(err)
        }else{
            oauth2Client = data;
            event.sender.send('authenticationComplete',null);
        }
    })
});

/*
*/
ipcMain.on('viewDirectory',function(event, folder){
    var search = require(__dirname+'/search.js')
    search.listChildern(oauth2Client,folder,(data)=>{
        event.sender.send('updateFolderView', data)
    });
})

ipcMain.on('download',function(event, folderInfo){
    var search = require(__dirname+'/search.js')
    var path = dialog.showOpenDialog({
        properties: ['openDirectory'],
        message: "choose Folder path"
    });
    
})

app.on('ready', createWindow);
