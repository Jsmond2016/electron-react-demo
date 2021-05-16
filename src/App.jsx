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
