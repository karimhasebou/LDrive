const google = require('googleapis')
const service = google.drive('v3')

exports.listChildernPromise = function(oauth2Client, folder){
    var query = `'${folder}' in parents and trashed=false`
    var fields = "nextPageToken, files(id, name, mimeType)"

    return list(oauth2Client,query, fields)
}

exports.listChildern = function(oauth2Client, folder, callback){
    var query = `'${folder}' in parents and trashed=false`
    var fields = "nextPageToken, files(id, name, mimeType)"

    list(oauth2Client,query, fields).then(callback,function(error){
        callback(null);
        console.log('listing childern error');
    })
}

function list(oauth2Client, query, fields){
    return new Promise(function(resolve, reject){

        service.files.list({
            q: query,
            auth: oauth2Client,
            fields: fields,
            pageSize: 1000
        },function(err, response){
            if (err) {
                console.log(err)
                reject(err)
            }else{
                resolve(response.files)
            }
        })
    })
}

exports.listAllFolders = function(oauth2Client, callback) {
    var results = []
    var loop = function(pageToken) {
        service.files.list({
            q: "mimeType='application/vnd.google-apps.folder'",
            fields: 'nextPageToken, files(id, name, mimeType)',
            spaces: 'drive',
            auth: oauth2Client,
            pageToken: pageToken,
            pageSize: 1000
        }, (err, res) => {
            if (err) {
                callback(err, null)
                console.log(error + "listing all folders err")
            } else {
                results = results.concat(res.files)
                if (res.nextPageToken) {
                    console.log('reading net page token')
                    loop(res.nextPageToken)
                } else {
                    callback(null, results)
                    console.log('read all folders')
                }
            }
        })
    }
    loop(null)
}
