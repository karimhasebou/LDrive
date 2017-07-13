const Store = require('electron-store')
const store = new Store()
const SYNC  = "SYNC"

exports.save = function(dest, data){
    store.set(dest, data)
}

exports.load = function(dest){
    var result = store.get(dest, null)
}

exports.addToSyncList = function(folderId, properties){
    store.get(SYNC).folderId = properties
}

exports.getSyncList = function(){
    return store.get(SYNC)
}

if(!store.has(SYNC)){
    store.set(SYNC, {})
}
