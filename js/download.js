var service = google.drive('v3');
var downloadQueue = []
var downloading = false;

exports.downloadFile = function(file, type, dest, callback){
    downloadQueue.push([file, type, dest, callback])
    processDownload();
}

exports.currentDownload = function(){
    if(downloadQueue.length == 0)
        return null
    else
        return downloadQueue[0]
}

function processDownload(){
    if(downloadQueue.length  >  0 && !downloading){
        var request = downloadQueue[0];
        downloading = true
        downloadBinary(request[0], request[2]).then((file)=>{
            downloading = false
            downloadQueue.shift()
            request[2](null, request[0])
            processDownload()
        },(err)=>{
            request[2](new Error('failed to download file'), request[1])
            downloading = false
        })
    }
}

function downloadBinary(file, dest){
    var iostream = fs.createWriteStream(dest);
    service.files.get({
       fileId: file,
       alt: 'media'
    })
    .on('end',()=>{resolve(file)})
    .on('error',(err)=>{reject(err)})
    .pipe(iostream);
}

function downloadDocument(file, dest){
    var dest = fs.createWriteStream(dest);
    drive.files.export({
       fileId: file,
       mimeType: 'application/pdf'
    })
    .on('end',()=>{resolve(file)})
    .on('error',(err)=>{reject(err)})
    .pipe(dest);
}
