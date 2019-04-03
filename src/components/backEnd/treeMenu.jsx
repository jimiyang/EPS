import React, {Component} from 'react';
import {TreeSelect} from 'antd';

//商品类型模版
const TreeNode = TreeSelect.TreeNode;
class TreeMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parent_id: 0,
      treeData: [],
      disabled: false,
    };
  }

  componentWillMount() {
    this.setState({parent_id: this.props.parent_id, disabled: this.props.disabled, treeData: this.props.productTypeData});
  }

  componentWillReceiveProps(props) {
    this.setState({treeData: props.productTypeData, disabled: this.props.disabled, parent_id: props.parent_id});
  }

  // 层级改变的change事件
  selParentEvent = (value) => {
    let hierarchy = 0;
    this.state.treeData.forEach(item => {
      item.id === value ? hierarchy = item.goods_category_hierarchy : null;
    });
    this.setState({parent_id: value});
    this.props.selParentEvent(value, hierarchy);
  }

  render() {
    return (
      <div className="typeedit-blocks">
        <TreeSelect
          dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
          placeholder="请选择父级目录"
          treeDefaultExpandAll
          onSelect={this.selParentEvent}
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
