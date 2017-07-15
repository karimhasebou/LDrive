const google = require('googleapis');

exports.listChildern = function(oauth2Client, folder, callback){
    var query = `'${folder}' in parents and trashed=false`
    var fields = "nextPageToken, files(id, name, mimeType)"

    list(oauth2Client,query, fields).then(callback,function(error){
        callback(null);
        console.log('listing childern error');
    })
}

exports.listFiles = function(oauth2Client, folder, callback){
    var files_query = `'${folder}' in parents and trashed=false`
    var fields = "nextPageToken, files(id, name, mimeType)"

    var start = list(oauth2Client,folders_query, fields)

    start.then(callback,function(error){
        callback(null);
        console.log('listing childern error');
    })
}

function list(oauth2Client, query, fields){
    return new Promise(function(resolve, reject){
        var service = google.drive('v3');

        service.files.list({
            q: query,
            auth: oauth2Client,
            fields: fields
        },function(err, response){
            if (err) {
                console.log(err)
                reject(err);
            }else{
                resolve(response.files);
            }
        });
    });
}
