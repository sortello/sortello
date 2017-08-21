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
      leftCard: null,
      rightCard: null,
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
    if (this.state.blacklist.indexOf(this.state.leftCard.value.id) > -1) {
      this.cardClicked("right");
    }
    else if (this.state.blacklist.indexOf(this.state.rightCard.value.id) > -1) {
      this.cardClicked("left");
    }
  },
  addToBlacklist: function (nodeId) {
    let bl = this.state.blacklist;
    bl.push(nodeId);
    this.setState({
      blacklist: bl
    }, function () {
      this.autoChoice();
    });
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
    }, function(){
      this.handleCardPositioned();
    });
  },
  toTheNextStep: function(){
    this.setState({
      rootNode: treeRebalancer(this.state.rootNode),
      progress: Math.round(((100 * (this.props.nodes.length - this.state.listNodes.length)) / (this.props.nodes.length)))
    }, function(){
      this.nextStepOrEnd();
    });
  },
  handleCardPositioned: function(){
    if (this.state.node.isPositioned) {
      this.toTheNextStep();
    } else {
      this.getNextChoice();
    }
  },
  nextStepOrEnd: function () {
    if (0 < this.state.listNodes.length) {
      this.setState({
        node: this.state.listNodes.shift(),
        compareNode: this.state.rootNode,
        listNodes: this.state.listNodes
      }, this.getNextChoice);
    } else {
      this.endChoices();
    }
  },
  getNextChoice: function () {
    let component = this;
    component.setState({
      leftCard: component.state.node,
      rightCard: component.state.compareNode
    }, function () {
      component.autoChoice();
    });
  },
  startChoices: function () {
    this.props.setStartTimeStamp(Date.now())
    this.nextStepOrEnd();
  },
  render: function () {
    if (this.state.leftCard == null || this.state.rightCard == null) {
      return (<span>Loading...</span>);
    }
    return (
      <div id="second_div">
        <div className="container__choose-card">
          <div className="choose-card__heading">Select the highest priority card</div>
          <Card id="left_button" side="left" handleClick={this.cardClicked}
                forget={this.addToBlacklist} data={this.state.leftCard.value}/>
          <Card id="right_button" side="right" handleClick={this.cardClicked}
                forget={this.addToBlacklist} data={this.state.rightCard.value}/>
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
