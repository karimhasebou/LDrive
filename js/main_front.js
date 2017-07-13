const {ipcRenderer}  = require("electron")
const currentDirectory = [];// contains to arrays of 2 elements. first is folder name, second folder id

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
        template_str += `<div class="selectableItems" \
            id="${folders_list[i].id}">  ${folders_list[i].name} </div>`;
    }

    list.innerHTML = template_str;
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

    var len = currentDirectory.length - 1
    for(var i = 0; i < len;i++){
        template_str += `<li><button>${currentDirectory[i]}<button></li>`
    }
    template_str += `<li><button>${currentDirectory[len]}</button></li>`

    address.innerHTML = template_str + `</ul>`;
}


function openFolder(elem){
    currentDirectory.push(elem)
    getDirectoryContent()
}

function  getDirectoryContent(event, arg){
    console.log('authentication comple')
    var len = currentDirectory.length - 1
    ipcRenderer.send("viewDirectory", currentDirectory[len]);
}

ipcRenderer.on('updateFolderView', function(event, arg){
    console.log('update view')
    if(arg != null){
        updateFolderView(arg[0]);
        updateFileView(arg[1]);
        updateAddressView();
    }
});

ipcRenderer.on('authenticationComplete',function(event, arg){
    openFolder('root')
})

ipcRenderer.send('authenticate',null);
