const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const url = require('url')
const path = require('path')

const fs = require('fs')
const readline = require('readline')
const google = require('googleapis')
const googleAuth = require('google-auth-library')
const searchDrive = require(__dirname + '/search.js')
const cacheManager = require(__dirname + '/cacheManager.js')
const downloadManager = require(__dirname + '/downloadManager.js')

let win
let oauth2Client

function createWindow(){
    win = new BrowserWindow({width: 800, height: 600})
    win.loadURL(url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true
    }))
}

app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit()
    }
})

ipcMain.on('authenticate', function(event, arg){
    console.log('tring to obtain authentication')
    var auth = require(__dirname+'/auth.js')
    auth.getAuth(function(err, data){
        if(err){
            console.log(err)
            console.log('something weird')
        }else{
            oauth2Client = data
            console.log('authenticationComplete')
            event.sender.send('authenticationComplete',null)
            downloadManager.setAuthClient(oauth2Client)
        }
    })
})

/*
*/
ipcMain.on('viewDirectory',function(event, folder){
    var folderContent = cacheManager.loadFolderContent(folder)

    if(folderContent == null){
        searchDrive.listChildern(oauth2Client,folder,(data)=>{
            cacheManager.saveFolderContent(folder, data)
            folderContent = data
        })
    }

    event.sender.send('updateFolderView', folderContent)
})

ipcMain.on('downloadRequest',function(event, folder){
    var path = dialog.showOpenDialog({
        properties: ['openDirectory'],
        message: "choose Folder path"
    })
    path += `/${folder.name.trim()}`
    console.log("path: "+path)
    var files = cacheManager.loadFolderContent(folder.id)

    downloadManager.download(files, path, (err,data)=>{
        if(err){
            console.error(err + "download failed")
        }else{
            console.log(data + 'download successful')
        }
    })
})

ipcMain.on('buildCache', (event, data)=>{
    if(cacheManager.isCacheReady()){
        event.sender.send('buildCache',null)
        console.log('cache already ready')
    }else{
        cacheManager.buildCache(oauth2Client,(err)=>{
            event.sender.send('buildCache',err)
        })
    }
})


app.on('ready', createWindow)
