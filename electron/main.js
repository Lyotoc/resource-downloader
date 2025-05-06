const { ElectronEgg, ipcMain, dialog } = require('ee-core');
const { Lifecycle } = require('./preload/lifecycle');
const { preload } = require('./preload');
const { webcaptureService } = require('./service/webcapture');

// new app
const app = new ElectronEgg();

// register lifecycle
const life = new Lifecycle();
app.register("ready", life.ready);
app.register("electron-app-ready", life.electronAppReady);
app.register("window-ready", life.windowReady);
app.register("before-close", life.beforeClose);

// register preload
app.register("preload", preload);

// run
app.run();

// Capture website
ipcMain.handle('capture-website', async (event, { url, options }) => {
  return webcaptureService.captureWebsite({ url, options });
});

// Save file
ipcMain.on('save-file', async (event, item) => {
  webcaptureService.saveFile(item);
});
