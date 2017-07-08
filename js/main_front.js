const {ipcRenderer}  = require("electron")
const currentDirectory = ['root'];

function download(){

}

function settings(){

}

function sync(){

}

function refresh_folders_list(folders_list){
    var list = document.getElementById('folders_list');
    var template_str = ""

    for(var i = 0; i < folders_list.length;i++){
        var x = folders_list[i].id
        template_str += `<button onclick="open_folder(this)" id="${x}">  ${folders_list[i].name} </button>`;
    }

    list.innerHTML = template_str;
}

function refresh_files_list(files_list){
    list = document.getElementById('files_list');
    var template_str = ""

    for(var i = 0; i < files_list.length;i++){
        template_str += '<button>' + files_list[i].name + '</button>';
    }

    list.innerHTML = template_str;
}

function open_folder(elem){
    currentDirectory.push(elem.id)
    get_directory_content(null,null)
}

function  get_directory_content(event, arg){
    console.log('authentication comple')
    var len = currentDirectory.length - 1
    ipcRenderer.send("view_folders_in_directory", currentDirectory[len]);
    ipcRenderer.send("view_files_in_directory", currentDirectory[len]);
}

ipcRenderer.on('updateFolderView', function(event, arg){
    console.log('update view')
    if(arg != null){
        refresh_folders_list(arg[0]);
        refresh_files_list(arg[1]);
    }
});

ipcRenderer.on('authenticationComplete',function(event, arg){
    ipcRenderer.send('viewDirectory',currentDirectory[0])
})

ipcRenderer.send('authenticate',null);
