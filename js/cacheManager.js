const Store = require('electron-store')
const search = require(__dirname + '/search.js')
const promise = require('bluebird');

const store = new Store()
const SYNC_LIST = "SYNC"
const FOLDER_CONTENT = "FOLDER_CONTENT"
const FOLDER_WATCH_LIST = "FOLDER_WATCH_LIST"
const FILE_NAME = "FILE_NAME"
const CACHE_STATUS = 'CACHE_STATUS'
const MY_REF = this

exports.addToWatchList = function(folderId){
    var x = store.get(FOLDER_WATCH_LIST, [])
    x.push(folderId)
    store.set(FOLDER_WATCH_LIST, x)
}

exports.getWatchList  = function(){
    return store.get(FOLDER_WATCH_LIST, [])
}

exports.saveFolderContent = function(folderId, files) {
    var key = FOLDER_CONTENT + `.${folderId}`
    store.set(key, files)
}

exports.loadFolderContent = function(folderId) {
    var key = FOLDER_CONTENT + `.${folderId}`
    return store.get(key, null)
}

exports.isCacheReady = function(){
    return store.has(FOLDER_CONTENT+'.root')
}

exports.buildCache = function(oauth2Client, callback) {
    var error = function() {
        callback(new Error('Failed to load all folders'))
        store.delete(FOLDER_CONTENT)
    }
    var folderContent = function(err, list) {
        if(err){
            callback(err)
        }else{
            promise.each(list,(item)=>{
                return search.listChildernPromise(oauth2Client,
                    item.id).then((data)=>{
                    MY_REF.saveFolderContent(item.id, data)
                })
            }).then(()=>{callback(null)},error)
        }
    }
    search.listAllFolders(oauth2Client, folderContent);
}
