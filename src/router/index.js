import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {hot} from 'react-hot-loader';
//登陆
import Login from '../containers/login/login';
//主页
import Main from '../containers/backEnd/main';
//前台
import index from '../containers/frontEnd/index';

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
        <Router path="/index" component={index} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default hot(module)(Root);
