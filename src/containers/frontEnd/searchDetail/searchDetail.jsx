import React, {Component} from 'react';
import './searchDetail.less';

class SearchDetail extends Component {
  state = {
  }
  componentWillMount() {
    console.log(1);
  }
  componentDidMount() {
    console.log(2);
  }
  componentWillReceiveProps() {
    console.log(this.props);
  }
  shouldComponentUpdate() {
    console.log(4);
    return true;
  }
  componentWillUpdate() {
    console.log(5);
  }
  componentDidUpdate() {
    console.log(6);
  }
  componentWillUnmount() {
    console.log(7);
  }
  render() {
    return (
      <div>searchDetail</div>
    );
  }
}

export default SearchDetail;
