const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    create_page: (callback) => ipcRenderer.on('CREATE_PAGE', callback),
    render_timeline: (callback) => ipcRenderer.on('RENDER_TL', callback)
})