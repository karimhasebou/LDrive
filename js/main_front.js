const {ipcRenderer}  = require("electron")
const path_stack = ['root'];

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
    path_stack.push(elem.id)
    get_directory_content(null,null)
}

function  get_directory_content(event, arg){
    console.log('authentication comple')
    var len = path_stack.length - 1
    ipcRenderer.send("view_folders_in_directory", path_stack[len]);
    ipcRenderer.send("view_files_in_directory", path_stack[len]);
}

ipcRenderer.on('update_folder_view', function(event, arg){
    refresh_folders_list(arg[0]);
    refresh_files_list(arg[1]);
});

ipcRenderer.on('authentication_complete',function(event, arg){
    
})

ipcRenderer.send('authenticate',null);
