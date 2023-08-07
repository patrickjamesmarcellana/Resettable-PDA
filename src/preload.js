const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    create_page: (callback) => ipcRenderer.on('CREATE_PAGE', callback),
    render_timeline: (callback) => ipcRenderer.on('RENDER_TL', callback),
    load_machine: (given_input_string) => ipcRenderer.send('LOAD_MACHINE', given_input_string)
})