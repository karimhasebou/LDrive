const {ipcRenderer}  = require("electron")
const currentDirectory = [];// contains to arrays of 2 elements. first is folder name, second folder id
var selectedFolder = null;

function download(){
    ipcRenderer.send('download',selectedFolder)
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
            ondblclick="openFolder({name: this.innerHTML, id: this.id})" onclick="selectFolder(this.id,this.innerHTML)">\
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
        template_str += `<li><button id="${i}" onclick="showFromHistory(this.id)">\
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

function  getDirectoryContent(event, arg){
    console.log('authentication comple')
    var len = currentDirectory.length - 1
    ipcRenderer.send("viewDirectory", currentDirectory[len].id);
}

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
    openFolder({name: 'root', id: 'root'})
})

ipcRenderer.send('authenticate',null);
