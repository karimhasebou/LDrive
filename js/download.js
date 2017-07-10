var service = google.drive('v3');
var downloadQueue = []

exports.downloadFile = function(file, dest, callback){

}


function downloadBinary(file, dest){
    return new Promise((resolve, reject)=>{
        var iostream = fs.createWriteStream(dest);
        service.files.get({
           fileId: file,
           alt: 'media'
        })
        .on('end',()=>{resolve(file)})
        .on('error',(err)=>{reject(err)})
        .pipe(iostream);
    })
}

function downloadDocument(file, dest){
    return new Promise((resolve, reject)=>{
        var dest = fs.createWriteStream(dest);
        drive.files.export({
           fileId: file,
           mimeType: 'application/pdf'
        })
        .on('end',()=>{resolve(file)})
        .on('error',(err)=>{reject(err)})
        .pipe(dest);
    })
}
