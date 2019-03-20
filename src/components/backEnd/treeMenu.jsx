import React, {Component} from 'react';

import {
  TreeSelect,
  message
} from 'antd';
//商品类型模版
const TreeNode = TreeSelect.TreeNode;
function LoadTreeChildren(id) {
  this.state.treeData.map((childData, i) => {
    if (id === childData.superior_id) {
      return (<TreeNode value={childData.id} title={childData.goods_category_name} key={childData.id}>
        LoadTreeChildren(id)
      </TreeNode>);
    }
  });
}
class TreeMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        id: '',
        goods_category_name: '',
        superior_id: ''
      },
      parent_id: 0,
      treeData: [],
      disabled: false
    };
  }
  componentWillMount() {
    this.setState({
      parent_id: this.props.parent_id,
      disabled: this.props.disabled,
    });
    this.loadTreeList();
  }
  componentWillReceiveProps(props) {
    if (props.productTypeData === undefined) {
      this.loadTreeList();
    } else {
      this.setState({
        treeData: props.productTypeData
      });
    }
    this.setState({
      parent_id: props.parent_id
    });
  }
  loadTreeList = () => {
    window.api('goods.getcategorylist', {}).then((rs) => {
      let productTypeData = [];
      productTypeData = rs.goods_category_list;
      if (productTypeData.length > 0) {
        this.setState({
          treeData: productTypeData
        });
      }
    }).catch(error => {
      message.error(error);
    });
  }
  selParentEvent = (value) => {
    const form = Object.assign({}, this.state.form, {superior_id: value});
    this.setState({
      form,
      parent_id: value
    });
    this.props.selParentEvent(value);
  }
  render() {
    return (
      <div className="typeedit-blocks">
        <TreeSelect
          dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
          placeholder="请选择父级目录"
          treeDefaultExpandAll
          onChange={this.selParentEvent}
          value={this.state.parent_id}
          disabled={this.state.disabled}
        >
          <TreeNode value="" title="请选择分类" key="0" >
            {
              this.state.treeData.map((item) => (
                (item.superior_id === 0) ? (
                  <TreeNode value={item.id} title={item.goods_category_name} key={item.id}>
                    {
                      this.state.treeData.map((childData) => (
                        (item.id === childData.superior_id) ? (
                          <TreeNode value={childData.id} title={childData.goods_category_name} key={childData.id} >
                            {
                              this.state.treeData.map((third) => (
                                (childData.id === third.superior_id) ? (
                                  <TreeNode value={third.id} title={third.goods_category_name} key={third.id} />
                                ) : null
                              ))
                            }
                          </TreeNode>
                        ) : null
                      ))
                    }
                  </TreeNode>
                ) : null
              ))
            }
          </TreeNode>
        </TreeSelect>
      </div>
    );
  }
}
export default TreeMenu;
