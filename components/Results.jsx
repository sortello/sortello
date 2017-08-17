import React from "react"
import Header from './Header.jsx';
import traverseTree from "../model/traverseTree"
import AlmostDoneAnimation from './AlmostDoneAnimation.jsx';

const Results = React.createClass({
  getInitialState: function () {
    return {uploadDone: false, duration: null};
  },
  componentDidUpdate () {
    this.props.centerContent();
  },
  componentDidMount () {
    this.props.centerContent();
    this.setDuration();
  },
  setDuration: function () {
    var component = this;
    let start = this.props.startTimeStamp
    let end = Date.now()
    component.setState({
      duration: end - start
    })
  },
  updateBoard: function () {
    var component = this;

    function showUploadDone () {
      component.setState({
        uploadDone: true
      })
    }

    var reorderedNodes = traverseTree(this.props.rootNode);
    var putCalls = reorderedNodes.length;
    var position = 100;
    if (gaTrackingId && this.state.duration !== null) {
      console.log('Finished in ' + this.state.duration + ' ms with ' + putCalls + ' cards');
      ga('send', {
        hitType: 'event',
        eventCategory: 'Time stats',
        eventAction: putCalls,
        eventLabel: this.state.duration
      });
    }
    var Trello = this.props.Trello;
    for (var j = 0; j < reorderedNodes.length; j++) {
      // console.log(reorderedNodes[j]);
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
        <div className={"send-ordered__wrapper"}>
          <div id="last_div" className={"send-ordered__container"}>
            <div className={""}>
              {this.state.uploadDone ?
                  <div>Done!
                    <br/>
                    <br/>
                    <div className="send-ordered__button button__primary">
                      <a href={"https://trello.com/b/" + this.props.rootNode.value.idBoard} target="_blank"
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
                  </div> :
                  <div>
                    <AlmostDoneAnimation />
                    <div className="send-ordered__heading">Almost done!</div>
                    <div className="send-ordered__button button__primary button__text">
                      <button id="update_board" onClick={this.updateBoard}>
                        Send ordered data to your board
                      </button>
                    </div>
                  </div>
              }
            </div>
          </div>
        </div>
    )
  }
})

export default Results
