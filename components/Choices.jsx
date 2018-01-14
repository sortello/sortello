import React from "react";
import Card from './Card.jsx';
import {clone} from "lodash"
import Engine from "../model/Engine.js"
import io from 'socket.io-client';
import {find} from "lodash"
import {findIndex} from "lodash"
import {remove} from "lodash"
import CopyToClipboard from "./CopyToClipboard.jsx"
import Room from "../model/Room.js"
import ChoicesView from './view/ChoicesView.jsx'

let socket = false;
if (typeof socketAddress !== 'undefined') {
  if (socketAddress !== null) {
    socket = io(socketAddress);
  }
}

class Choices extends React.Component {

  constructor (props) {
    super(props);
    this.engine = new Engine(clone(this.props.nodes), clone(this.props.rootNode))
    this.handleCardClicked = this.handleCardClicked.bind(this)
    this.cardClicked = this.cardClicked.bind(this)
    this.handleAddToBlacklist = this.handleAddToBlacklist.bind(this)
    this.handleUndoClicked = this.handleUndoClicked.bind(this)
    this.startChoices = this.startChoices.bind(this)
    this.createRoom = this.createRoom.bind(this)
    this.removeVoter = this.removeVoter.bind(this)
    this.addVoter = this.addVoter.bind(this)
    this.handleGoToNextVoting = this.handleGoToNextVoting.bind(this)
    this.registerVote = this.registerVote.bind(this)
    let component = this
    component.props.Trello.members.get('me', {}, function (data) {
      component.trelloId = data.id
      component.trelloAvatar = '//trello-avatars.s3.amazonaws.com/' + data.avatarHash + '/50.png'
      if (data.avatarHash === null) {
        component.trelloAvatar = '//www.gravatar.com/avatar/' + data.gravatarHash + '?s=64&d=identicon'
      }
    }, function (e) {
      console.log(e);
    });
    this.room = false;
    this.state = {
      leftCard: null,
      rightCard: null,
      roomId: null,
      leftVoters: [],
      rightVoters: [],
      roomVoters: [],
      everyBodyVoted: false
    }

  }

  // Admin wants to create a new room
  createRoom () {
    let component = this;
    let randomKey = '';
    let chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    for (let i = 32; i > 0; --i) randomKey += chars[Math.floor(Math.random() * chars.length)];
    this.room = new Room(socket, randomKey)
    this.room.open(randomKey)
    socket.on('newRoomOpened', roomId => {
      console.log("new room opened")
      component.setState({
        roomId: roomId
      })
    })

    console.log(this.room)

    socket.on('voterJoined', function (voterId, trelloAvatar) {
      component.addVoter(voterId, trelloAvatar);
    })

    socket.on('voterLeft', function (voterId) {
      component.removeVoter(voterId)
    })

    socket.on('getCurrentChoice', function () {
      component.room.castNextChoice(component.state.leftCard, component.state.rightCard)
    })

    socket.on('cardClicked', function (side, trelloId, trelloAvatar) {
      component.registerVote(side, trelloId, trelloAvatar)
    })

    socket.on('getBoardIdFromMaster', function () {
      component.room.castBoardId(component.props.boardId)
    })
  }

  registerVote (side, trelloId, trelloAvatar) {
    let component = this;
    let voter = {
      voterId: trelloId,
      trelloId: trelloId,
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
  }

  checkTotalVotes () {
    let component = this;
    if (this.state.roomVoters.length == 0) {
      return
    }
    if ((this.state.leftVoters.length + this.state.rightVoters.length) >= 1 + this.state.roomVoters.length) {
      this.setState({
        everyBodyVoted: true,
      }, function () {
        if (component.room) {
          component.room.castVotesInfo(component.state.leftVoters, component.state.rightVoters)
        }
      })
    }
  }

  removeVoter (voterId) {
    let component = this
    if (find(component.state.roomVoters, {'id': voterId}) == undefined) {
      return
    }

    let newVoters = component.state.roomVoters.slice(); //copy array
    let index = findIndex(newVoters, function (item) {
      return item.id == voterId
    })
    newVoters.splice(index, 1); //remove element
    component.setState({
      roomVoters: newVoters
    })
  }

  addVoter (voterId, trelloAvatar) {
    let component = this
    if (find(component.state.roomVoters, {'id': voterId}) !== undefined) {
      return
    }
    let voters = component.state.roomVoters.concat({id: voterId, avatar: trelloAvatar});
    component.setState({
      roomVoters: voters
    })
  }

  startChoices () {
    this.props.setStartTimeStamp(Date.now())
    this.engine.nextStepOrEnd();
    this.getNextChoice()
  }

  getNextChoice () {
    let component = this
    this.setState({
      hasVoted: false,
      everyBodyVoted: false
    }, function () {
      if (component.room) {
        component.room.castVotesInfo([], [])
      }
    })
    if (this.engine.getEnded()) {
      if (this.room) {
        this.room.castPrioritizationEnded()
      }
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
        if (this.room) {
          this.room.castNextChoice(this.state.leftCard, this.state.rightCard)
        }
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

  cardClicked (side) {
    this.engine.choiceMade(side, "human");
    this.getNextChoice()
  }

  handleGoToNextVoting (side) {
    this.cardClicked(side)
  }

  handleCardClicked (side) {
    if (this.state.roomVoters.length === 0) {
      this.cardClicked(side)
    }

    if (this.state.hasVoted) {
      return
    }
    let component = this

    let voter = {
      voterId: component.trelloId,
      trelloId: component.trelloId,
      trelloAvatar: component.trelloAvatar
    }

    component.setState({
      hasVoted: true
    })

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
  }

  getProgress () {
    return Math.round(((100 * (this.props.nodes.length - this.engine.getListNodes().length - 1)) / (this.props.nodes.length)))
  }

  renderCard (id, side, value) {
    return (
      <Card id={id} side={side} handleClick={this.handleCardClicked}
            forget={this.handleAddToBlacklist} data={value}/>
    )
  }

  render () {
    let copyToClipboardBtn = <button>Copy to clipboard</button>
    let copyToClipboardSuccess = <button>Copied to clipboard</button>
    let copyToClipboardError = <button>Error</button>

    if (this.state.leftCard == null || this.state.rightCard == null) {
      return (<div><span>Loading...</span></div>);
    }
    let roomLink = '';
    if (this.state.roomId !== null) {
      let shareLink = window.location.protocol + "//" + window.location.hostname + window.location.pathname + '?roomKey=' + this.state.roomId
      roomLink = <p>
        Share Link: <input id="room-link" type="text" readOnly value={shareLink} size="50"/>
        <CopyToClipboard text={shareLink} copyChildren={copyToClipboardBtn} successChildren={copyToClipboardSuccess}
                         errorChildren={copyToClipboardError}/>
      </p>
    }
    let leftContinueButton = '';
    if (this.state.everyBodyVoted) {
      leftContinueButton = <div id="left-continue-voting" className="card-button__continue"
                                onClick={() => this.handleGoToNextVoting('node')}>Continue</div>;
    }
    let rightContinueButton = '';
    if (this.state.everyBodyVoted) {
      rightContinueButton = <div id="right-continue-voting" className="card-button__continue"
                                 onClick={() => this.handleGoToNextVoting('compareNode')}>Continue</div>;
    }
    let newRoomButton = '';
    if (socket) {
      newRoomButton =
        <button id="new-room-button" className={"button__open-room"} onClick={this.createRoom}>Open new room</button>
    }
    return (
      <ChoicesView
        leftContinueButton={leftContinueButton}
        rightContinueButton={rightContinueButton}
        newRoomButton={newRoomButton}
        roomLink = {roomLink}
        roomVoters = {this.state.roomVoters}
        leftCard = {this.state.leftCard}
        rightCard = {this.state.rightCard}
        everybodyVoted = {this.state.everyBodyVoted}
        leftVoters={this.state.leftVoters}
        rightVoters={this.state.rightVoters}
        handleAddToBlacklist={this.handleAddToBlacklist}
        handleCardClicked={this.handleCardClicked}
        handleUndoClicked={this.handleUndoClicked}
        handleGoToNextVoting={this.handleGoToNextVoting}
        roomId={this.state.roomId}
        progress={this.getProgress()}
      />
    )
  }
}

export default Choices
