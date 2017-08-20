import React from "react";
import Header from './Header.jsx';
import TreeDraw from './TreeDraw.jsx';
import Card from './Card.jsx';
import treeRebalancer from "../model/treeRebalancer";
import Footer from "./Footer.jsx"

const Choices = React.createClass({
  getInitialState: function () {
    return {
      Trello: this.props.Trello,
      leftNode: null,
      rightNode: null,
      progress: 0,
      listNodes: this.props.nodes,
      rootNode: this.props.rootNode,
      blacklist: [], // the nodes to position in the tree
      node: null,
      compareNode: null,
    }
  },
  endChoices: function () {
    this.props.setSortedRootNode(this.state.rootNode);
  },
  autoChoice: function () {
    if (this.state.blacklist.indexOf(this.state.leftNode.value.id) > -1) {
      $("#right_button .container__card").click();
    }
    else if (this.state.blacklist.indexOf(this.state.rightNode.value.id) > -1) {
      $("#left_button .container__card").click();
    }
  },
  addToBlacklist: function (nodeId) {
    let bl = this.state.blacklist;
    bl.push(nodeId);
    this.setState({
      blacklist: bl
    });
    console.log(this.state.blacklist);
    this.autoChoice();
  },
  cardClicked: function (side) {
    let compareNode;
    if ("left" == side) {
      compareNode = this.state.node.goLeft(this.state.compareNode);
    }
    else if ("right" == side) {
      compareNode = this.state.node.goRight(this.state.compareNode);
    }
    this.setState({
      compareNode: compareNode,
      node: this.state.node
    });

    if (this.state.node.isPositioned) {
      this.setState({
        rootNode: treeRebalancer(this.state.rootNode),
        progress: Math.round(((100 * (this.props.nodes.length - this.state.listNodes.length)) / (this.props.nodes.length)))
      });
      this.choicesCycle();
    } else {
      this.getNextChoice();
    }
  },
  choicesCycle: function () {
    if (0 < this.state.listNodes.length) {
      this.setState({
        node: this.state.listNodes.shift(),
        compareNode: this.state.rootNode,
        listNodes: this.state.listNodes
      });

      this.getNextChoice();
    } else {
      jQuery("#left_button").html("");
      jQuery("#right_button").html("");
      this.endChoices();
    }
  },
  getNextChoice: function () {
    let component = this;

    component.setState({
      leftNode: component.state.node,
      rightNode: component.state.compareNode
    });

    jQuery(".button-blacklist").unbind("click");
    jQuery(".button-blacklist").click(function (e) {
      e.stopPropagation();
      let nodeId = $(this).attr("data-cardid");
      component.addToBlacklist(nodeId);
    });

    jQuery(".container__card").click(function () {
      jQuery(".container__card").unbind("click");

      if ($(this).hasClass("left_button")) {
        component.cardClicked("left");
      } else if ($(this).hasClass("right_button")) {
        component.cardClicked("right");
      }

    });
    component.autoChoice();
  },
  startChoices: function () {
    this.props.setStartTimeStamp(Date.now())

    var component = this;

    component.choicesCycle();
  },

  render: function () {
    if (this.state.leftNode == null || this.state.rightNode == null) {
      return (<span>Loading...</span>);
    }
    return (
      <div id="second_div">
        <div className="container__choose-card">
          <div className="choose-card__heading">Select the highest priority card</div>
          <Card id="left_button" data={this.state.leftNode.value}/>
          <Card id="right_button" data={this.state.rightNode.value}/>
          {/*<TreeDraw tree={this.state.rootNode}></TreeDraw>*/}
        </div>
        <div className="container__prioritization-status">
          <div className="text__prioritization-status">Prioritization status</div>
          <div className={"progressive-bar__status-structure"}>
            <div className={"progressive-bar__status"} role="progressbar" aria-valuenow={this.state.progress}
                 aria-valuemin="0"
                 aria-valuemax="100" style={{width: this.state.progress + '%'}}>
            </div>
          </div>
        </div>
        <div className={"logout__button"}>
          <Header/>
        </div>
        <div className={"footer"}>
          <Footer/>
        </div>

      </div>
    )
  }
})

export default Choices
