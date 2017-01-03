import React from "react"

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
      jQuery(".choice_button").click(function () {
        if ($(this).attr("id") == "left_button") {
          compareNode = node.goLeft(compareNode);
        } else if ($(this).attr("id") == "right_button") {
          compareNode = node.goRight(compareNode);
        }
        jQuery(".choice_button").unbind("click");
        if (node.isPositioned) {
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
          <div className={"row"}>
            <h2>Select the highest priority card</h2>
          </div>
          <div className={"centered_content row"}>
            <div className={"col-md-6"}>
              <div className={"jumbotron choice_button"} id="left_button" data-cardId="0">
                <h1></h1>
                <p className={"card_content"}></p>
                <p className={"card_link"}>
                  <a className={"btn btn-primary btn-lg card_link"} href="#" target="_blank"
                     role="button">See card</a>
                </p>
              </div>
            </div>
            <div className={"col-md-6"}>
              <div className={"jumbotron choice_button"} id="right_button" data-cardId="0">
                <h1></h1>
                <p className={"card_content"}></p>
                <p className={"card_link"}>
                  <a className={"btn btn-primary btn-lg card_link"} href="#" target="_blank" role="button">See card</a>
                </p>
              </div>
            </div>
          </div>
        </div>
    )
  }
})

export default Choices
