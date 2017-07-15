const Store = require('electron-store')
const store = new Store()

const SYNC_LIST  = "SYNC"
const FOLDER_CONTENT = "FOLDER_CONTENT"
const FILE_NAME = "FILE_NAME"

exports.saveFolderContent = function(folderId, files){
    var key = FOLDER_CONTENT+`.${folderId}`
    // var set = store.get(key, null)
    //
    // if(set == null)
    //     set = new Set()
    //
    // for(var i = 0; i < files.length; i++){
    //     set.add(files[i])
    //     console.log(files[i], i)
    // }

    store.set(key, files)
}

exports.loadFolderContent = function(folderId){
    var key = FOLDER_CONTENT + `.${folderId}`
    return store.get(key, null)
}
