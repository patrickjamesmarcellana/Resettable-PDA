const { app, BrowserWindow } = require('electron')
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
        load_test_script(electronWindow)
    })
})

