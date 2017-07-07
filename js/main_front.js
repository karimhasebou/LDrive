const {ipcRenderer}  = require("electron")

var folders_list = [];
var files_list = [];
const path_stack = ['root'];

function download(){

}

function settings(){

}

function sync(){
    
}

function refresh_list(){
    refresh_files_list();
    refresh_folders_list();
}

function refresh_folders_list(){
    var list = document.getElementById('folders_list');
    var template_str = ""

    for(var i = 0; i < folders_list.length;i++){
        var x = folders_list[i].id
        template_str += `<button onclick="open_folder(this)" id="${x}">  ${folders_list[i].name} </button>`;
    }

    list.innerHTML = template_str;
}

function refresh_files_list(){
    list = document.getElementById('files_list');
    var template_str = ""

    for(var i = 0; i < files_list.length;i++){
        template_str += '<button>' + files_list[i].name + '</button>';
    }

    list.innerHTML = template_str;
}

function open_folder(elem){
    path_stack.push(elem.id)
    get_directory_content(null,null)
}

function  get_directory_content(event, arg){
    console.log('authentication comple')
    var len = path_stack.length - 1
    ipcRenderer.send("view_folders_in_directory", path_stack[len]);
    ipcRenderer.send("view_files_in_directory", path_stack[len]);
}

ipcRenderer.on('authentication_complete',get_directory_content);

ipcRenderer.on('view_folders_in_directory', function(event,  list){
    console.log('main front got list of folders')
    folders_list = list;
    refresh_folders_list();
});

ipcRenderer.on('view_files_in_directory', function(event,  list){
    console.log('main front got list of files')
    files_list = list;
    refresh_files_list();
});

ipcRenderer.on('set_folders_list', function(event, list){
    folders_list =  list;
});

ipcRenderer.on('set_files_list', function(event, list){
    files_list = list;
});

ipcRenderer.on('refresh_list', function(event, arg){
    refresh_list();
});

ipcRenderer.send('authenticate',null);