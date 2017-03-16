import React from "react"
import Header from './Header.jsx';
import traverseTree from "../model/traverseTree"

const Results = React.createClass({
  getInitialState: function () {
    return {uploadDone: false};
  },

  updateBoard: function () {
    var component = this;

    function showUploadDone () {
      component.setState({
        uploadDone: true
      })
    }

    var reorderedNodes = traverseTree(this.props.getRootNode());
    var putCalls = reorderedNodes.length;
    var position = 100;
    var Trello = this.props.Trello;
    for (var j = 0; j < reorderedNodes.length; j++) {
      console.log(reorderedNodes[j]);
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
            { this.state.uploadDone ?
                <p>Done!
                  <br/>
                  <br/>
                  <div className="send-ordered-data--button">
                    <a href={ "https://trello.com/b/" + this.props.getRootNode().value.idBoard} target="_blank"
                       className={"btn"}>
                      <i className="fa fa-trello"></i>&nbsp;
                      Check your Trello board
                    </a>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <a href="/" className={"btn"}>
                      <i className="fa fa-repeat"></i>&nbsp;
                      Prioritize another list
                    </a>
                  </div>
                </p> :
                <div>
                  <p>Almost done!</p>
                  <div className="send-ordered-data--button">
                    <button className={"btn"} id="update_board" onClick={this.updateBoard}>
                      Send ordered data to your board
                    </button>
                  </div>
                </div>
            }
          </div>
        </div>
    )
  }
})

export default Results
