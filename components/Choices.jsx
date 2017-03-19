import React from "react";
import Header from './Header.jsx';
import Card from './Card.jsx';
import treeRebalancer from "../model/treeRebalancer";

const Choices = React.createClass({
  getInitialState: function(){
    return {
      Trello: this.props.Trello,
      leftNode: null,
      rightNode: null
    }
  },
  endChoices: function(rootNode){
    this.props.setSortedRootNode(rootNode);
  },
  startChoices: function(){

    var nodes = this.props.nodes;
    var rootNode = this.props.rootNode;
    var component = this;

    function getChoice(node, compareNode, currNode) {
      component.setState({
        leftNode: node,
        rightNode: compareNode
      });

      jQuery(".choices--button").click(function () {
        if ($(this).attr("id") == "left_button") {
          compareNode = node.goLeft(compareNode);
        } else if ($(this).attr("id") == "right_button") {
          compareNode = node.goRight(compareNode);
        }
        jQuery(".choices--button").unbind("click");
        if (node.isPositioned) {
          rootNode = treeRebalancer(rootNode);
          choicesCycle(currNode + 1);
        } else {
          getChoice(node, compareNode, currNode);
        }
      });
    }

    function choicesCycle(currNode) {
      if (currNode < nodes.length) {
        getChoice(nodes[currNode], rootNode, currNode);
      } else {
        jQuery("#left_button").html("");
        jQuery("#right_button").html("");
        component.endChoices(rootNode);
      }
    }

    choicesCycle(1);
  },
  render: function() {
    if (this.state.leftNode == null || this.state.rightNode == null) {
      return (<span>Loading...</span>);
    }
    return (
        <div id="second_div" className={"centered_content"}>
          <div className={"row choices--title"}>
            <p>Select the highest priority card</p>
          </div>
          <div className={"centered_content row choices--container"}>
            <Card id="left_button" data={this.state.leftNode.value}/>
            <Card id="right_button" data={this.state.rightNode.value}/>
          </div>
          <div className={"row logout--header"}>
            <Header />
          </div>
        </div>
    )
  }
})

export default Choices
