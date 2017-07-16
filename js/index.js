const {ipcRenderer}  = require("electron")
const currentDirectory = [];
var selectedFolder = null;

function download(){

}

function settings(){

}

function sync(){

}

function updateFolderView(folders_list){
    var list = document.getElementById('folders_list');
    var template_str = ""

    for(var i = 0; i < folders_list.length;i++){
        template_str += `<li \
            id="${folders_list[i].id}"\
            ondblclick="openFolder({name: this.innerHTML, id: this.id})"\
            onclick="selectFolder(this.id,this.innerHTML)">\
            ${folders_list[i].name} </li>`;
    }

    list.innerHTML = template_str;
}

function selectFolder(elemId, innerHTML){
    selectedFolder = {"id":elemId, "name":innerHeight}
}

function updateFileView(files_list){
    var list = document.getElementById('files_list');
    var template_str = ""

    for(var i = 0; i < files_list.length;i++){
        template_str += '<li>' + files_list[i].name + '</li>';
    }

    list.innerHTML = template_str;
}

function updateAddressView(){
    var address = document.getElementById('address_view')
    var template_str = `<ul>`

    var len = currentDirectory.length
    for(var i = 0; i < len;i++){
        template_str += `<li><button id="${i}"\
            onclick="showFromHistory(this.id)">\
            ${currentDirectory[i].name}</button></li>`
    }
    address.innerHTML = template_str + `</ul>`;
}

function showFromHistory(offset){
    for(var i = currentDirectory.length-1; i > offset; i--)
        currentDirectory.pop()
    getDirectoryContent()
}

function openFolder(elem){
    currentDirectory.push(elem)
    getDirectoryContent()
}

function  getDirectoryContent(){
    var len = currentDirectory.length - 1
    ipcRenderer.send("viewDirectory", currentDirectory[len].id)
}

/**list of files where each file must contain id, name and mimeType
**/
ipcRenderer.on('updateFolderView', function(event, arg){
    console.log('update view')
    folderList = []
    fileList = []

    if(arg != null){
        for (var i = 0; i < arg.length; i++){
            if(arg[i].mimeType == "application/vnd.google-apps.folder")
                folderList.push(arg[i])
            else
                fileList.push(arg[i])
        }
        updateFolderView(folderList);
        updateFileView(fileList);
        updateAddressView();
    }
});

ipcRenderer.on('authenticationComplete',function(event, arg){
    ipcRenderer.send('buildCache', null);
    console.log('building cache')
})

ipcRenderer.on('buildCache',(event, err)=>{
    if(err){
        alert("Error connecting to GDrive, please try later")
    }else{
        openFolder({name: "root", id:"root"})
    }
})

ipcRenderer.send('authenticate',null)
console.log('asking for authentication')
