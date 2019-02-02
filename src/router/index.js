import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {hot} from 'react-hot-loader';
//登陆
import Login from '../containers/login/login';
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
    <div className="router-content">
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route path="/" component={Main} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default hot(module)(Root);
