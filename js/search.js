const google = require('googleapis');

exports.listChildern = function(oauth2Client, folder, callback){
    var files_query = `'${folder}' in parents and trashed=false \
        and mimeType != 'application/vnd.google-apps.folder'`
    var folders_query = `'${folder}' in parents and trashed=false \
        and mimeType = 'application/vnd.google-apps.folder'`
    var fields = "nextPageToken, files(id, name)"

    var start = Promise.all([list(oauth2Client,folders_query, fields),
        list(oauth2Client,files_query, fields)])

    start.then(callback,function(error){
        callback(null);
        console.log('listing childern error');
    })
}

exports.listFiles = function(oauth2Client, folder, callback){
    var files_query = `'${folder}' in parents and trashed=false \
        and mimeType != 'application/vnd.google-apps.folder'`
    var fields = "nextPageToken, files(id, name)"

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
