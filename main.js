const { app, BrowserWindow, autoUpdater, ipcMain, dialog } = require("electron")

const path = require("path")
const url = require("url")

const { platform, env } = process

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Keep a timestamp of when the last update occured
let lastUpdateAttemptAt

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 })

  if (env.NODE_ENV === 'development') {
    win.webContents.openDevTools()
  }

  // Load the login page by default.
  win.loadURL(`file://${__dirname}/login.html`)

  // Load the login page when user is unauthenticated.
  ipcMain.on("unauthenticated", (event) => {

    win.loadURL(`file://${__dirname}/login.html`)
  })

  // Load our app when user is authenticated.
  ipcMain.on("userScreen", async event => {
    win.loadURL(`file://${__dirname}/index.html`)

    if (env.NODE_ENV === 'development') {
      return // Skip updates on development env
    }
  })
  ipcMain.on("adminScreen", async event => {
    win.loadURL(`file://${__dirname}/admin.html`)

    if (env.NODE_ENV === 'development') {
      return // Skip updates on development env
    }
  })

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow)

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
