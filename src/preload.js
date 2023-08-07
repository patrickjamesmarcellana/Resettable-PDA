/*
    GROUP MEMBERS:
    Chua, Harvey Shawn
    Marcellana, Patrick James
    Mider, Brett Harley
*/

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    create_page: (callback) => ipcRenderer.on('CREATE_PAGE', callback),
    render_timeline: (callback) => ipcRenderer.on('RENDER_TL', callback),
    change_file_path: (callback) => ipcRenderer.on('CHANGE_FP', callback),
    set_message: (callback) => ipcRenderer.on('SET_MSG', callback),
    load_file: (file_path) => ipcRenderer.send('LOAD_FILE', file_path),
    load_machine: (given_input_string) => ipcRenderer.send('LOAD_MACHINE', given_input_string)
})