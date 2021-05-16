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