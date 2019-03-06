import React from 'react';
import {BrowserRouter, Route, Switch, history} from 'react-router-dom';
import {hot} from 'react-hot-loader';
import {Provider} from 'react-redux';
import {LocaleProvider} from 'antd';
import cn from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import Store from '../store';
import DevTools from '../store/DevTools';
//登陆
import Login from '../containers/frontEnd/login/login';
//前台
import app from '../containers/frontEnd/app/app';
//后台主页(入口) jimiyang
import Main from '../containers/backEnd/main/main';

moment.locale('cn');

const Router = ({component: Component, children, ...rest}) => (
  <Route
    {...rest}
    render={props => (
      <Component {...props} ><Switch>{children}</Switch></Component>
    )}
  />
);
const authRequired = (nextState, replace) => {
  console.log(window.localStorage.getItem('type'));
  const state = store.getState();
  if (state.admin !== 1) {
    history.replace('/');
  }
  console.log(state);
};
console.log(Store);
const Root = () => (
  <LocaleProvider locale={cn}>
    <BrowserRouter>
      <Provider store={Store}>
        <div className="router-content">
          {__DEVELOPMENT__ && <DevTools />}
          <Switch history={history}>
            <Route exact path="/login" component={Login} />
            <Route onEnter={authRequired} path="/" component={Main} />
          </Switch>
        </div>
      </Provider>
    </BrowserRouter>
  </LocaleProvider>
);

export default hot(module)(Root);
