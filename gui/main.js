const { app, BrowserWindow, Menu, Notification } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
// const notifier = require('node-notifier')


app.setName("AEye Health");

const menuItems = [
	{
		label: app.name,
		submenu: [
			{
				label: "About",
			},
			{
				label: "Quit",
				click: () => app.quit(),
				accelerator: process.platform !== "darwin" ? "Ctrl+Q" : "Cmd+Q",
			},
		],
	},
	{
		label: "File",
		submenu: [
			{
				label: "Learn More",
				click: async () => {
					await shell.openExternal(
						"https://www.aoa.org/healthy-eyes/eye-and-vision-conditions/computer-vision-syndrome?sso=y"
					);
				},
			},
			{
				type: "separator",
			},
		],
	},
];

function createWindow() {
	const win = new BrowserWindow({
		width: 1050,
		height: 750,
		title: "AEye Health",
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	win.loadFile(path.join(__dirname, "index.html"));

	const pythonProcess = spawn("python", ["engine/faces.py"]);

	pythonProcess.stdout.on("data", (data) => {
		console.log("Python script output:", data.toString());
	});

	pythonProcess.stderr.on("data", (data) => {
		console.error("Python script error:", data.toString());
	});

	pythonProcess.on("close", (code) => {
		console.log("Python script process exited with code", code);
	});

}



app.whenReady().then(() => {
	createWindow();

	const mainMenu = Menu.buildFromTemplate(menuItems);
	Menu.setApplicationMenu(mainMenu);

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length == 0) createWindow();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});


         
// document.getElementById('notify').onclick = (event) => {
//     notifier.notify ({
//     title: 'My awesome title',
//     message: 'Hello from electron, Mr. User!',         
//     sound: true,
//     wait: true
            
//     }, function (err, response) {
//                // Response is response from notification
//     });

//         notifier.on('click', function (notifierObject, options) {
//         console.log("You clicked on the notification")
//     });

//         notifier.on('timeout', function (notifierObject, options) {
//         console.log("Notification timed out!")
//     });
// }