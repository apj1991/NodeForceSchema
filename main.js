const { app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path');
let xlsx = require('xlsx');
const { spawn } = require('child_process');
let login = require('./login.js');
let at = '';

function createWindow () {
	  const win = new BrowserWindow({
		width: 1200,
		height: 1000,
		minwidth: 1200,
		minheight: 1000,
		show : false,
		webPreferences: {
		  //preload: path.join(__dirname, 'preload.js')
		  nodeIntegration: true,
		  contextIsolation: false,
		  enableRemoteModule: true,
		}
	  });
	win.loadFile('./app/index.html');
	win.setMenu(null);
	//win.maximize();
	// win.webContents.openDevTools()
	win.show();
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
  
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// listen to application messages
ipcMain.on( 'to-main', (e,a) => {
    console.log( 'received Message', a );
	at = test();
	e.sender.send('asynchronous-reply', at);
})

ipcMain.on("showDialog", (e, message) => {
	
	dialog.showSaveDialog(BrowserWindow.getFocusedWindow(),{title: 'Download to File…', defaultPath: message.name}).then((r)=>{
		console.log(r);
		xlsx.writeFile(message.wb, r.filePath, {bookType: 'xlsx',type: 'file'});
	});
	
})

async function test(){
	return await login();
}

