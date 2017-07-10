const Store = require('electron-store')
const store = new Store()

exports.save = function(dest, data){
    store.set(dest, data)
}

exports.load = function(dest){
    var result = store.get(dest, null)
}
