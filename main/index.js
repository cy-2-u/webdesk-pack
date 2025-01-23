const { app, BrowserWindow, Menu, screen } = require("electron");
const env = require("./env.json");

class App {
  constructor() {
    this.mainWindow = null;
    this.isQuit = false;

    this.init();
  }

  init() {
    app.whenReady().then(() => {
      this.initMenu();
      this.createWindow();

      app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow();
        } else if (this.mainWindow) {
          this.mainWindow.show();
        }
      });
    });

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    app.on("before-quit", () => {
      this.isQuit = true;
    });
  }

  initMenu() {
    const toggleFullScreen = () => {
      const window = this.mainWindow;
      if (window) {
        window.setFullScreen(!window.isFullScreen());
      }
    };
    const menuTemplate = [
      {
        label: "窗口",
        submenu: [
          {
            label: "返回上一页",
            click: () => {
              if(this.mainWindow){
                this.mainWindow.webContents.goBack()
              }
            },
            enabled: () => this.mainWindow && this.mainWindow.webContents.canGoBack(),
          },
          { label: "刷新", role: "reload" },
          { label: "强制刷新", role: "forceReload" },
          {
            label: "进入全屏",
            click: toggleFullScreen,
            enabled: () => this.mainWindow && this.mainWindow.isVisible(),
            accelerator: "F11",
          },
          {
            label: "退出全屏",
            click: toggleFullScreen,
            enabled: () => this.mainWindow && this.mainWindow.isFullScreen(),
            accelerator: "F11",
          },
          { label: "最小化", role: "minimize" },
          { label: "退出应用", role: "quit" },
        ],
      },
    ];
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
  }

  createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    this.mainWindow = new BrowserWindow({
      width: width || 1280,
      height: height || 720,
      show: false,
      title: env.name,
      webPreferences: {
        contextIsolation: true, // Recommended for security
        enableRemoteModule: false, // Disable remote module if not needed
      },
    });

    // Disable HTTP cache
    app.commandLine.appendSwitch("--disable-http-cache");

    this.mainWindow.loadURL(env.url);

    // Handle window show with delay or when content loads
    let isShow = false;
    const showTimeout = setTimeout(() => {
      if (this.mainWindow) {
        this.mainWindow.show();
        isShow = true;
      }
    }, 3000);

    this.mainWindow.webContents.on("did-finish-load", () => {
      if (!isShow) {
        clearTimeout(showTimeout);
        this.mainWindow.show();
        isShow = true;
      }
    });

    this.mainWindow.on("close", (event) => {
      if (!this.isQuit) {
        event.preventDefault();
        this.mainWindow.hide();
      } else {
        this.mainWindow = null;
      }
    });
  }
}

// Initialize and run the app
new App();
