import React from "react"
import Header from './Header.jsx';
import traverseTree from "../model/traverseTree"

const treeNode = {
  "position": "relative",
  "display": "inline-block",
  "margin": "0px 10px",
  "vertical-align": "top"
};

const Results = React.createClass({
  printNode: function (node) {
    if (node !== undefined && typeof node === 'object' && node !== null) {
      return <div>{node.value.name}
              <br/>
              <div style={treeNode}>{this.printLeft(node.left)}</div>
              <div style={treeNode}>{this.printRight(node.right)}</div>
            </div>;
    }
  },
  printLeft: function (subtree) {
    return this.printNode(subtree);
  },
  printRight: function (subtree) {
    return this.printNode(subtree);
  },
  render: function () {
    return (
        <div id="tree_draw" className={"centered_content send-ordered--container"}>
          <div>{this.printNode(this.props.tree)}</div>
        </div>
    )
  }
})


export default Results
