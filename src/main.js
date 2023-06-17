const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

const menuItems = [
	{
		label: "Menu",
		submenu: [
			{
				label: "About",
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
			{
				label: "Quit",
				click: () => app.quit(),
			},
		],
	},
];

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1050,
		height: 750,
	});

	if (process.env.NODE_ENV == "development") {
		win.webContents.openDevTools();
	}

	win.loadFile(path.join(__dirname, "index.html"));
};

app.whenReady().then(() => {
	createWindow();

	const mainMenu = Menu.buildFromTemplate(menuItems);
	Menu.setApplicationMenu(mainMenu);

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length == 0) createWindow();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
