初始化 electron-react 项目

本文参考：

- [超详实！带你一步步搭建Electron10+React16+Antd4架构工程](https://mp.weixin.qq.com/s/24SiiGZQSlFQKkYMLTX9dg) 付费文章，公众号打开查看全文
- [Building a React Desktop App with Electron](https://blog.bitsrc.io/building-an-electron-app-with-electron-react-boilerplate-c7ef8d010a91)

## 项目搭建

- 使用 [create-react-app](https://www.html.cn/create-react-app/docs/getting-started/) 搭建基本框架
- 安装路由等：

```bash
yarn add react-dom
yarn add react-router-dom
yarn add antd
```

- 删除不必要的文件

## 添加 `Electron` 等核心依赖

- 配置镜像：

```
yarn config set ELECTRON_MIRROR https://npm.taobao.org/mirrors/electron/
```

- 安装其他依赖：

```bash
yarn add electron electron-builder wait-on
yarn add electron-is-dev concurrently
```

- 进行配置：`package.json` 配置

```json
"homepage": "./",
"main": "./src/main.js",
"scripts": {
  "ebuild": "npm run build && node_modules/.bin/build",
  "dev": "concurrently \"npm start\" \"wait-on http://localhost:3000 && electron .\""
}
```

## 启动测试：

```
yarn dev
```

## 功能开发：利用 nodejs 读取目录文件名

- 更改 `src/App.jsx` 文件

```jsx
import React, { useState, useEffect } from 'react'
import { Button, List } from 'antd'

const { ipcRenderer } = window.require('electron')

function App() {

  const [fileList, setList] = useState([])

  const onReady = () => {
    ipcRenderer.on('readDir-reply', (event, result) => {
      if (!result.cnaceled) {
        setList(result.fileList)
      } else {
        console.log('取消选择操作')
      }
    })
  }

  const readDir = () => {
    ipcRenderer.send('readDir', '传递给主进程的参数')
  }

  useEffect(() => {
    onReady()
  }, [])

  const listProps = {
    header: <div>文件列表</div>,
    borderd: true,
    style:{ padding: '0 20px' },
    dataSource: fileList,
    renderItem: (item) => <List.Item>{item}</List.Item>
  }

  return (
    <div className="App">
      <h1>electron-cra</h1>
      <Button type="primary"  onClick={readDir}>Button</Button>
      <List {...listProps} />
    </div>
  );
}

export default App;
```

- 新建 `src/read-dir.js` 文件

```js
const { ipcMain, dialog } = require('electron')

const fs = require('fs')
const path = require('path')

ipcMain.on('readDir', (event, args) => {
  dialog.showOpenDialog(({
    // 只允许选择文件夹
    properties: ['openDirectory']
  }))
  .then((result) => {
    if (!result.canceled) {
      console.log('result: ', result);
      result.fileList = loadFilesInDir(result.filePaths[0])
      console.log('result.fileList: ', result.fileList);
      event.reply('readDir-reply', result)
    }
  })
})


function loadFilesInDir(dir) {
  let fileList = []
  // 读取目录下全部文件及子目录
  let files = fs.readdirSync(dir)
  for (let i=0; i<files.length; i++) {
    let filePath = path.join(dir, files[i])
    // 获取信息
    let fileData = fs.statSync(filePath)
    // 判断是文件还是目录
    if (fileData.isFile()) {
      // 若是文件，记录下来
      fileList.push(filePath)
    }  else {
      // 若是目录，递归遍历，拼接结果
      fileList = fileList.concat(loadFilesInDir(filePath))
    }
  }
  return fileList
}

```

- 新建 `main.js` 文件

```js
const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true, //是否使用node
            enableRemoteModule: true, //是否有子页面
            contextIsolation: false, //是否禁止node
            nodeIntegrationInSubFrames: true, //否允许在子页面(iframe)或子窗口(child window)中集成Node.js
        },
    });
    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;

    mainWindow.loadURL(startURL);

    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
app.on('ready', createWindow);


require('./read-dir')

```
 
## 完成，测试

```bash
yarn dev
```

启动后，即可点击按钮，选择对应目录，查看效果


## 小结

这里踩了个坑：若需要使用 Nodejs，需要配置：

```js
mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  show: false,
  // 里面的代码是核心配置
  webPreferences: {
    nodeIntegration: true, //是否使用node
    enableRemoteModule: true, //是否有子页面
    contextIsolation: false, //是否禁止node
    nodeIntegrationInSubFrames: true, //否允许在子页面(iframe)或子窗口(child window)中集成Node.js
  },
})
```

## TODOS

- [ ] Vue + Electron 开发
- [ ] Vite + Vue/React 开发
- [ ] 项目实战和实现


**参考资料**

- [基于 react + electron 开发及结合爬虫的应用实践](https://juejin.cn/post/6934660187668086791)
- [Building a React Desktop App with Electron](https://blog.bitsrc.io/building-an-electron-app-with-electron-react-boilerplate-c7ef8d010a91)
- [electron-react-boilerplate](https://github.com/fliegwerk/electron-react-boilerplate)
- [Today-wallpapers](https://github.com/blazer233/Today-wallpapers)
