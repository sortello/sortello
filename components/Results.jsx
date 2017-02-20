import React from "react"
import Header from './Header.jsx';
import traverseTree from "../model/traverseTree"

const Results = React.createClass({
  updateBoard: function () {

    function showUploadDone() {
      jQuery(".almost").css("text-decoration", "line-through");
      jQuery(".done").text("Done!");
      jQuery("#update_board").fadeTo(500, 0, function () {
        jQuery("#update_board").animate({
          "width": "0px",
          "padding": "0px"
        });
        jQuery(".checkboard").css("display", "inline-block");
      });
    }

    var reorderedNodes = traverseTree(this.props.getRootNode());
    var putCalls = reorderedNodes.length;
    var position = 100;
    var Trello = this.props.Trello;
    for (var j = 0; j < reorderedNodes.length; j++) {
      Trello.put('/cards/' + reorderedNodes[j].value.id, {pos: '' + position}, function () {
        putCalls--;
        if (putCalls == 0) {
          showUploadDone();
        }
      });
      position += 100;
    }
  },
  render: function () {
    return (
        <div id="last_div" className={"centered_content"}>
          <Header />
          <div className={"centered_content"}>
            <span className={"almost"}>Almost</span> <span className={"done"}> done:</span>
            <br/>
            <button className={"btn btn-large btn-success"} id="update_board" onClick={this.updateBoard}>Send ordered
              data to board
            </button>
            <span className={"checkboard"}> Check your Trello board :)</span>
          </div>
        </div>
    )
  }
})

export default Results
