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
        <div id="last_div" className={"centered_content send-ordered--container"}>
          <div className={"centered_content almost-done--position"}>
            <p>Almost done!</p>
          </div>
          <div className="send-ordered-data--button">
            <button className={"btn"} id="update_board" onClick={this.updateBoard}>
              Send ordered data to your board
            </button>
          </div>
        </div>
    )
  }
})

export default Results
