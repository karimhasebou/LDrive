const google = require('googleapis')
const drive = google.drive('v3')
const promise = require('bluebird')
const fs = require('fs')
const taskQueue = []
const callbackQueue = []
const fileDest = []

var running = false
var oauth2Client

exports.setAuthClient = function (oauth){
    oauth2Client = oauth
}

exports.download = function(files, dest, callback) {
    for (var i in files) {
        taskQueue.push(files[i])
        callbackQueue.push(callback)
        fileDest.push(dest)
    }
    processQueue()
}

function processQueue() {
    if (!running && taskQueue.length > 0) {
        running = true
        var file = taskQueue.shift()
        var call = callbackQueue.shift()
        var dest = fileDest.shift()

        console.log(dest)
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }

        if (isGoogleDoc(file.mimeType))
            downloadDoc(file, dest, call)
        else
            downloadBinary(file, dest, call)
    }
}

function downloadBinary(file, dir, callback) {
    var dest = fs.createWriteStream(`${dir}/${file.name}`);
    drive.files.get({
            fileId: file.id,
            alt: 'media',
            auth: oauth2Client
        })
        .on('end', function() {
            console.log('Done');
            running = false
            processQueue()
            callback(null, file)
        })
        .on('error', function(err) {
            console.log('Error during download', err);
            running = false
            processQueue()
            callback(err, file)
        })
        .pipe(dest);
}

function downloadDoc(file, dir, callback) {
    var dest = fs.createWriteStream(`${dir}/${file.name}`);
    drive.files.export({
            fileId: file.id,
            mimeType: 'application/pdf',
            auth: oauth2Client
        })
        .on('end', function() {
            console.log('Done');
            running = false
            processQueue()
            callback(null, file)
        })
        .on('error', function(err) {
            console.log('Error during download', err);
            running = false
            processQueue()
            callback(null, file)
        })
        .pipe(dest);
}


function isGoogleDoc(mimeType) {
    return GOOGLE_DRIVE_FILE_TYPES.has(mimeType)
}

const GOOGLE_DRIVE_FILE_TYPES = new Set(
    ['application/vnd.google-apps.document',
        'application/vnd.google-apps.drawing',
        'application/vnd.google-apps.file',
        'application/vnd.google-apps.folder',
        'application/vnd.google-apps.form',
        'application/vnd.google-apps.fusiontable',
        'application/vnd.google-apps.map',
        'application/vnd.google-apps.presentation',
        'application/vnd.google-apps.script',
        'application/vnd.google-apps.sites',
        'application/vnd.google-apps.spreadsheet'
    ])
