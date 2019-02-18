import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {hot} from 'react-hot-loader';
import {Provider} from 'react-redux';
import Store from '../store';
import DevTools from '../store/DevTools';
//登陆
import Login from '../containers/login/login';
//前台
import index from '../containers/frontEnd/index/index';
//后台主页(入口) jimiyang
import Main from '../containers/backEnd/main/main';
import Center from '../containers/backEnd/center';
import ProductList from '../containers/backEnd/productManagement/list';

const Router = ({component: Component, children, ...rest}) => (
  <Route
    {...rest}
    render={props => (
      <Component {...props} ><Switch>{children}</Switch></Component>
    )}
  />
);

const Root = () => (
  <BrowserRouter>
    <Provider store={Store}>
      <div className="router-content">
        {__DEVELOPMENT__ && <DevTools />}
        <Switch>
          <Route exact path="/login" component={Login} />
          <Router path="/" component={index} />
        </Switch>
      </div>
    </Provider>
  </BrowserRouter>
);

export default hot(module)(Root);
