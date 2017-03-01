import React from "react";
import Header from './Header.jsx';
import treeRebalancer from "../model/treeRebalancer";

const Choices = React.createClass({
  getInitialState: function(){
    return {
      Trello: this.props.Trello,
    }
  },
  endChoices: function(rootNode){
    this.props.setSortedRootNode(rootNode);
  },
  startChoices: function(){

    var nodes = this.props.getNodes();
    var rootNode = this.props.getRootNode();
    var that = this;

    function getChoice(node, compareNode, currNode) {
      jQuery("#left_button h1").html(node.value.name);
      jQuery("#left_button .card_content").html(node.value.desc);
      jQuery("#left_button .card_link").prop("href", node.value.shortUrl);
      jQuery("#right_button h1").html(compareNode.value.name);
      jQuery("#right_button .card_content").html(compareNode.value.desc);
      jQuery("#right_button .card_link").prop("href", compareNode.value.shortUrl);
      jQuery(".choices--button").click(function () {
        console.log("button clicked");
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
        that.endChoices(rootNode);
      }
    }

    choicesCycle(1);
  },
  render: function() {
    return (
        <div id="second_div" className={"centered_content"}>

          <div className={"row choices--title"}>
            <p>Select the highest priority card</p>
          </div>
          <div className={"centered_content row choices--container"}>
            <div className={"col-md-6"}>
              <div className={"choices--button"} id="left_button" data-cardId="0">
                <h1></h1>
                <p className={"card_link"}>
                  <a className={"button--on-white btn-primary btn-lg"} href="#" target="_blank"
                     role="button">See card</a>
                </p>
              </div>
            </div>
            <div className={"col-md-6"}>
              <div className={"choices--button"} id="right_button" data-cardId="0">
                <h1></h1>
                <p className={"card_link"}>
                  <a className={"button--on-white btn-primary btn-lg"} href="#" target="_blank" role="button">See card</a>
                </p>
              </div>
            </div>
          </div>
          <div className={"row logout--header"}>
            <Header />
          </div>
        </div>
    )
  }
})

export default Choices
