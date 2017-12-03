import React from "react";
import Header from './Header.jsx';
import TreeDraw from './TreeDraw.jsx';
import Card from './Card.jsx';
import Footer from "./Footer.jsx"
import {clone} from "lodash"
import Engine from "../model/Engine.js"
import io from 'socket.io-client';
import {find} from "lodash"
import {remove} from "lodash"

const socket = io('http://localhost:8000/');

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
    let component = this
    component.props.Trello.members.get('me', {}, function (data) {
      component.trelloId = data.id
      component.trelloAvatar = '//trello-avatars.s3.amazonaws.com/' + data.avatarHash + '/50.png'
      if(data.avatarHash === null){
        component.trelloAvatar = '//www.gravatar.com/avatar/' + data.gravatarHash + '?s=64&d=identicon'
      }
    }, function (e) {
      console.log(e);
    });

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
      component.setState({
        roomId: roomId
      })
    })

    socket.on('voterJoined', function (voterId, trelloAvatar) {
      if(find(component.state.roomVoters, {'id': voterId}) !== undefined){
        return
      }
      let voters = component.state.roomVoters.concat({id : voterId, avatar: trelloAvatar});
      component.setState({
        roomVoters: voters
      },function(){
        console.log(component.state.roomVoters)
      })
    })

    socket.on('voterLeft', function (voterId) {
      component.removeVoter(voterId)
    })

    socket.on('getCurrentChoice', function () {
      socket.emit('nextChoice', component.state.leftCard, component.state.rightCard, component.state.roomId)
    })

    socket.on('cardClicked', function (side, trelloId, trelloAvatar) {

      let voter  = {
        voterId : trelloId,
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
      this.cardClicked('node');
    }
    if (this.state.rightVoters.length >= (this.state.roomVoters.length+1) / 2) { // Must count admin
      this.cardClicked('compareNode');
    }
  }

  removeVoter(voterId){
    if(find(component.state.roomVoters, {'id': voterId}) == undefined){
      return
    }
    console.log("vid" + voterId);
    console.log(component.state.roomVoters)
    let newVoters = remove(component.state.roomVoters, function(item) {
      return item.id === voterId;
    })
    console.log(newVoters)
    component.setState({
      roomVoters: newVoters
    },function(){
      console.log(component.state.roomVoters)
    })
  }

  startChoices () {
    this.props.setStartTimeStamp(Date.now())
    this.engine.nextStepOrEnd();
    this.getNextChoice()
  }

  getNextChoice () {
    this.setState({
      hasVoted: false
    })
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

  cardClicked (side) {
    this.engine.choiceMade(side, "human");
    this.getNextChoice()
  }

  handleCardClicked(side){
    if (this.state.hasVoted) {
      return
    }
    let component = this

    let voter  = {
      voterId : component.trelloId,
      trelloId : component.trelloId,
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

  renderCard(id, side, value){
    return (
      <Card id={id} side={side} handleClick={this.handleCardClicked}
            forget={this.handleAddToBlacklist} data={value}/>
    )
  }

  render () {
    if (this.state.leftCard == null || this.state.rightCard == null) {
      return (<div><span>Loading...</span></div>);
    }
    let roomLink = '';
    if (this.state.roomId !== null) {
      let shareLink = window.location.hostname + '?roomKey=' + this.state.roomId
      roomLink = <p>Share Link: <a id="room-link" href={'//' + shareLink}>{shareLink}</a></p>
    }
    return (
      <div id="second_div">
        <div className="container__choose-card">
          <div className="container__top-bar">
            <div className="choose-card__heading">Select the highest priority card</div>
            <div className="container__prioritization-status">
              <div className={"progressive-bar__status-structure"}>
                <div className={"progressive-bar__status"} role="progressbar" aria-valuenow={this.getProgress()}
                     aria-valuemin="0"
                     aria-valuemax="100" style={{width: this.getProgress() + '%'}}>
                </div>
              </div>
            </div>
          </div>
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
        <div className={"footer"}>
          <Footer/>
          <Header/>
        </div>
        <button id="new-room-button" onClick={this.createRoom}>Open new room</button>
        {roomLink}
        {this.state.roomVoters.map((item, index) => (
          <img className={'card__voter'} key={index} src={item.avatar}/>
        ))}
      </div>
    )
  }
}

export default Choices
