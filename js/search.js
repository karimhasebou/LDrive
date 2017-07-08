const google = require('googleapis');

exports.listChildern = function(oauth2Client, folder, callback){
    var files_query = `'${folder}' in parents and trashed=false \
        and mimeType != 'application/vnd.google-apps.folder'`
    var folders_query = `'${folder}' in parents and trashed=false \
        and mimeType = 'application/vnd.google-apps.folder'`
    var fields = "nextPageToken, files(id, name)"

    var start = Promise.all([list(oauth2Client,folder, folders_query),
        list(oauth2Client,folder, files_query)])

    start.then(function(results){
        callback(null, results);
    },function(error){
        callback(error, null);
    })
}

function list(oauth2Client, query, fields){
    return new Promise(function(resolve, reject){
        var service = google.drive('v3');

        service.files.list({
            q: query,
            auth: oauth2Client,
            fields: "nextPageToken, files(id, name)"
        },function(err, response){
            if (err) {
                reject(err);
            }
            resolve(response);
        });
    });
}
