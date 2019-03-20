import React from 'react';
import {BrowserRouter, Route, Switch, history, Redirect} from 'react-router-dom';
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
import App from '../containers/frontEnd/app/app';
//后台主页(入口) jimiyang
import Main from '../containers/backEnd/main/main';
import List from '../containers/backEnd/productManagement/list';
import DeliveryList from '../containers/backEnd/deliveryMangement/deliverylist';
import TypeList from '../containers/backEnd/productType/typelist';
import addGoods from '../containers/backEnd/productManagement/addGoods';
import NotFound from '../containers/404';

import goods from '../containers/frontEnd/goods/goods';
import searchDetail from '../containers/frontEnd/searchDetail/searchDetail';
import goodsDetail from '../containers/frontEnd/goodsDetail/goodsDetail';
import generateOrder from '../containers/frontEnd/generateOrder/generateOrder';
import cashier from '../containers/frontEnd/cashier/cashier';
import successfulPayment from '../containers/frontEnd/successfulPayment/successfulPayment';
import orderList from '../containers/frontEnd/orderList/orderList';
import orderDetail from '../containers/frontEnd/orderDetail/orderDetail';

moment.locale('cn');
const Router = ({component: Component, children, ...rest}) => (
  <Route
    {...rest}
    render={props => (
      <Component {...props} ><Switch>{children}</Switch></Component>
    )}
  />
);
const Root = () => (
  <LocaleProvider locale={cn}>
    <BrowserRouter>
      <Provider store={Store}>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Router path="/main" component={Main} >
            <Route exact path="/main/list" component={List} />
            <Route exact path="/main/deliverylist" component={DeliveryList} />
            <Route exact path="/main/typelist" component={TypeList} />
            <Route exact path="/main/addGoods" component={addGoods} />
            <Redirect to="/main/list" />
            <Route path="*" component={NotFound} />
          </Router>
          <Router path="/" component={App} >
            <Route exact path="/goods" component={goods} />
            <Route exact path="/searchDetail" component={searchDetail} />
            <Route exact path="/goodsDetail" component={goodsDetail} />
            <Route exact path="/generateOrder" component={generateOrder} />
            <Route exact path="/cashier" component={cashier} />
            <Route exact path="/successfulPayment" component={successfulPayment} />
            <Route exact path="/orderList" component={orderList} />
            <Route exact path="/orderDetail" component={orderDetail} />
            <Redirect to="/goods" />
            <Route path="*" component={NotFound} />
          </Router>
        </Switch>
      </Provider>
    </BrowserRouter>
  </LocaleProvider>
);

export default hot(module)(Root);
