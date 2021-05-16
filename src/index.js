import ReactDOM from 'react-dom';
import App from './App';
import Profile from './pages/Profile';
import { BrowserRouter, Route } from "react-router-dom";
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';


ReactDOM.render(
  <BrowserRouter>
    <div className="App">
      <Route path="/" exact component={App} />
      <Route path="/Profile" exact component={Profile} />
    </div>
  </BrowserRouter>,
  document.getElementById('root')
);