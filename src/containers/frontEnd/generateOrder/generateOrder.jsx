import React, {Component} from 'react';
import './generateOrder.less';

class GenerateOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillMount() {
  }
  componentDidMount() {
  }
  // 跳转到收银台
  toCashier = () => {
    this.props.history.push('/cashier');
  }
  render() {
    return (
      <div id="generateOrder">1</div>
    );
  }
}

export default GenerateOrder;
