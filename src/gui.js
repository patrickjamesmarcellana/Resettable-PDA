const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { load_test_script } = require('./main')

const createWindow = () => {
    const window = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    window.webContents.openDevTools()
    window.loadFile("index.html")

    return window
}


app.whenReady().then(() => {
    const electronWindow = createWindow()
    electronWindow.webContents.on("did-finish-load", () => {
        ipcMain.on("LOAD_MACHINE", (event, given_input_string) => {
            load_test_script(electronWindow, given_input_string)
        })
    })
})

