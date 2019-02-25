import React, {Component} from 'react';

import {Tree} from 'antd';

import './list.css';

const {TreeNode} = Tree;
const DirectoryTree = Tree.DirectoryTree;
class TreeMenu extends Component {
  componentWillMount() {}
  render() {
    return (
      <div className="tree-blocks">
        <DirectoryTree
          multiple
          defaultExpandAll
          onSelect={this.props.onSelect}
        >
          <TreeNode title="我的分类" key="0-0">
            <TreeNode title="软件" key="0-0-0" isLeaf />
            <TreeNode title="硬件" key="0-0-1" isLeaf />
          </TreeNode>
          <TreeNode title="POS机" key="0-1">
            <TreeNode title="拉卡拉" key="0-1-0" isLeaf />
            <TreeNode title="银联" key="0-1-1" isLeaf />
          </TreeNode>
        </DirectoryTree>
      </div>
    );
  }
}
export default TreeMenu;

