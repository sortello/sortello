import React from "react";
import Header from './Header.jsx';
import TreeDraw from './TreeDraw.jsx';
import Card from './Card.jsx';
import Footer from "./Footer.jsx"
import {clone} from "lodash"
import Engine from "../model/Engine.js"
import io from 'socket.io-client';

const socket = io('http://localhost:8000/');

class Choices extends React.Component {

  constructor (props) {
    super(props);
    this.engine = new Engine(clone(this.props.nodes), clone(this.props.rootNode))
    this.handleCardClicked = this.handleCardClicked.bind(this)
    this.handleAddToBlacklist = this.handleAddToBlacklist.bind(this)
    this.handleUndoClicked = this.handleUndoClicked.bind(this)
    this.startChoices = this.startChoices.bind(this)
    this.createRoom = this.createRoom.bind(this)

    this.state = {
      leftCard: null,
      rightCard: null,
      roomId: null,
      leftVoters: [],
      rightVoters: [],
      roomVoters: []
    }
  }

  // Admin wants to create a new room
  createRoom () {
    let component = this;
    socket.emit('openNewRoom')
    socket.on('newRoomOpened', roomId => {
      console.log(roomId)
      component.setState({
        roomId: roomId
      })
    })

    socket.on('voterJoined', function (voterId) {
      let voters = component.state.roomVoters.concat(voterId);
      component.setState({
        roomVoters: voters
      })
    })

    socket.on('voterLeft', function (voterId) {
      let voters = component.state.roomVoters;
      let index = voters.indexOf(voterId)
      voters.splice(index, 1);
      component.setState({roomVoters: voters});
    })

    socket.on('getCurrentChoice', function () {
      socket.emit('nextChoice', component.state.leftCard, component.state.rightCard, component.state.roomId)
    })

    socket.on('cardClicked', function (side, voterId, trelloId, trelloAvatar) {

      let voter  = {
        voterId : voterId,
          trelloId : trelloId,
        trelloAvatar: trelloAvatar
      }

      if ('node' === side) {
        let lv = component.state.leftVoters.concat(voter);
        component.setState({
          leftVoters: lv
        }, function () {
          component.checkTotalVotes()
        })
      }
      if ('compareNode' === side) {
        let rv = component.state.rightVoters.concat(voter);
        component.setState({
          rightVoters: rv
        }, function () {
          component.checkTotalVotes()
        })
      }
    })
  }

  checkTotalVotes () {
    if (this.state.leftVoters.length >= (this.state.roomVoters.length+1) / 2) { // Must count admin
      this.handleCardClicked('node');
    }
    if (this.state.rightVoters.length >= (this.state.roomVoters.length+1) / 2) { // Must count admin
      this.handleCardClicked('compareNode');
    }
  }

  startChoices () {
    this.props.setStartTimeStamp(Date.now())
    this.engine.nextStepOrEnd();
    this.getNextChoice()
  }

  getNextChoice () {
    if (this.engine.getEnded()) {
      socket.emit('prioritizationEnded', this.state.roomId)
      this.props.setSortedRootNode(this.engine.getRootNode());
    } else {
      this.setState({
        leftCard: this.engine.getNode(),
        rightCard: this.engine.getCompareNode(),
        leftVoters: [],
        rightVoters: []
      }, function () {
        if (this.engine.autoChoice()) {
          this.getNextChoice()
        }
        socket.emit('nextChoice', this.state.leftCard, this.state.rightCard, this.state.roomId)
      });
    }
  }

  handleUndoClicked () {
    this.engine.undo();
    this.getNextChoice()
  }

  handleAddToBlacklist (nodeId) {
    this.engine.addToBlackList(nodeId);
    this.getNextChoice();
  }

  handleCardClicked (side) {
    this.engine.choiceMade(side, "human");
    this.getNextChoice()
  }

  getProgress () {
    return Math.round(((100 * (this.props.nodes.length - this.engine.getListNodes().length - 1)) / (this.props.nodes.length)))
  }

  render () {
    if (this.state.leftCard == null || this.state.rightCard == null) {
      return (<span>Loading...</span>);
    }
    let roomLink = '';
    if (this.state.roomId !== null) {
      let shareLink = window.location.hostname + '?roomKey=' + this.state.roomId
      roomLink = <p>Share Link: <a href={'//' + shareLink}>{shareLink}</a></p>
    }
    return (
      <div id="second_div">
        <div className="container__choose-card">
          <div className="choose-card__heading">Select the highest priority card</div>
          <Card id="left_button" side="node" handleClick={this.handleCardClicked}
                forget={this.handleAddToBlacklist} data={this.state.leftCard.value} voters={this.state.leftVoters}/>
          <Card id="right_button" side="compareNode" handleClick={this.handleCardClicked}
                forget={this.handleAddToBlacklist} data={this.state.rightCard.value} voters={this.state.rightVoters}/>
          {/*<TreeDraw tree={this.state.rootNode}></TreeDraw>*/}

          <button onClick={() => this.handleUndoClicked()} id="undo_button" className="normalize__undo-button">
            <div className="undo__button">
              <div className="undo__icon">
                <img src="assets/icons/undo-icon.svg" alt=""/>
                Undo choice
              </div>
            </div>

          </button>

        </div>
        <div className="container__prioritization-status">
          <div className="text__prioritization-status">Prioritization progress</div>
          <div className={"progressive-bar__status-structure"}>
            <div className={"progressive-bar__status"} role="progressbar" aria-valuenow={this.getProgress()}
                 aria-valuemin="0"
                 aria-valuemax="100" style={{width: this.getProgress() + '%'}}>
            </div>
          </div>
        </div>
        <div className={"logout__button"}>
          <Header/>
        </div>
        <div className={"footer"}>
          <Footer/>
        </div>
        <button onClick={this.createRoom}>Open new room</button>
        {roomLink}
        Voters:
        {this.state.roomVoters.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    )
  }
}

export default Choices
