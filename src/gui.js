const fs = require('fs')    // file-system
const { app, BrowserWindow, dialog, ipcMain } = require('electron')
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
        let current_file_path

        // file_path - (optional) selected file path, will open file picker if null
        ipcMain.on("LOAD_FILE", (event, file_path) => {
            if(!file_path) {
                const selected_files = dialog.showOpenDialogSync({ properties: ['openFile'] })
                if(selected_files) {
                    current_file_path = selected_files[0]
                }
            } else {
                current_file_path = file_path
            }

            console.log("loaded", current_file_path)

            electronWindow.webContents.send("CHANGE_FP", fs.existsSync(current_file_path) ? current_file_path : "Invalid path.")
        })

        ipcMain.on("LOAD_MACHINE", (event, given_input_string) => {
            load_test_script(electronWindow, current_file_path, given_input_string)
        })
    })
})

