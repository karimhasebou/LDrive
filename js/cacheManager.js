const Store = require('electron-store')
const search = require(__dirname + '/search.js')

const store = new Store()
const SYNC_LIST = "SYNC"
const FOLDER_CONTENT = "FOLDER_CONTENT"
const FILE_NAME = "FILE_NAME"
const CACHE_STATUS = 'CACHE_STATUS'


exports.saveFolderContent = function(folderId, files) {
    var key = FOLDER_CONTENT + `.${folderId}`
    store.set(key, files)
}

exports.loadFolderContent = function(folderId) {
    var key = FOLDER_CONTENT + `.${folderId}`
    return store.get(key, null)
}

exports.isCacheReady = function(){
    return store.get(CACHE_STATUS, "FAILED") == 'SUCCESS'
}

exports.buildCache = function(oauth2Client, callback) {
    search.listAllFolders(oauth2Client, (err, folderList) => {
        if (err){
            callback(err)
            console.log(`error listing all folders ${err}`)
        }else {
            var tasks = []
            for (var i = 0; i < folderList.length; i++)
                tasks.push(search.listChildernPromise(oauth2Client, folderList[i].id))
            console.log("waiting for  all promises")
            Promise.all(tasks).then((folderContent) => {
                console.log("checking folders")
                for (var i = 0; i < folderContent.length; i++)
                    this.saveFolderContent(folderList[i].id, folderContent[i])
                console.log("done building cache")
                store.set(CACHE_STATUS, 'SUCCESS')
                callback(null)
            },(err)=>{
                callback(err)
                console.log("cannot build cache")
                console.log(err)
            })
        }
    })
}
