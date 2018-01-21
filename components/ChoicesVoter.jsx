import React from 'react';
import Header from './Header.jsx';
import Card from './Card.jsx';
import Footer from './Footer.jsx'
import {clone} from 'lodash'
import io from 'socket.io-client';
import queryString from 'query-string';
import PrioritizationEnd from './PrioritizationEnd.jsx'
import Room from '../model/Room.js'
import ChoicesView from './view/ChoicesView.jsx'

let socket = false;
if (typeof socketAddress !== 'undefined') {
  if (socketAddress !== null) {
    socket = io(socketAddress);
  }
}

const params = queryString.parse(location.search);

class Choices extends React.Component {
  constructor (props) {
    super(props);
    let component = this
    this.handleCardClicked = this.handleCardClicked.bind(this)
    this.Trello = this.props.Trello
    this.renderForbidden = this.renderForbidden.bind(this)
    this.renderLoading = this.renderLoading.bind(this)
    this.room = false;
    this.state = {
      leftCard: null,
      rightCard: null,
      ended: false,
      voters: {
        left: [],
        right: []
      },
      hasVoted: false,
      hasBoardPermissions: false
    }

    if (params.roomKey !== undefined) {
      component.state.roomId = params.roomKey
      if (socket) {
        this.room = new Room(socket, params.roomKey);
        socket.on('connect', function () {
          component.props.Trello.members.get('me', {}, function (data) {
            component.trelloId = data.id
            component.trelloAvatar = '//trello-avatars.s3.amazonaws.com/' + data.avatarHash + '/50.png'
            if (data.avatarHash === null) {
              component.trelloAvatar = '//www.gravatar.com/avatar/' + data.gravatarHash + '?s=64&d=identicon'
            }
            component.room.join(component.trelloId, component.trelloAvatar)
            component.room.getBoardId()
            component.room.getCurrentChoice()
          }, function (e) {
            console.log(e);
          });
        });

        window.addEventListener("beforeunload", (ev) => {
          ev.preventDefault()
          this.room.leave(component.trelloId)
        });
      }

    }
    if (socket) {
      socket.on('votesInfo', function (leftVoters, rightVoters) {
        component.setState({
          voters: {
            left: leftVoters,
            right: rightVoters,
          }
        })
      })

      socket.on('castBoardIdToVoters', function (boardId) {
        component.Trello.boards.get(boardId, function () {
          component.setState({
            hasBoardPermissions: true
          })
        }, function () {
          component.setState({
            hasBoardPermissions: false
          }, function () {
            component.room.leave(component.trelloId)
          })
        })
      })

      socket.on('nextChoice', function (leftCard, rightCard) {
        component.setState({
          leftCard: leftCard,
          rightCard: rightCard,
          hasVoted: false
        })
      })

      socket.on('prioritizationEnded', function () {
        component.setState({
          ended: true
        })
      })
    }
  }

  handleCardClicked (side) {
    if (!this.state.hasVoted && this.room) {
      this.room.castCardClicked(side, this.trelloId, this.trelloAvatar)
    }
    this.setState({
      hasVoted: true
    })
  }

  renderForbidden(){
      return <div id="forbidden-div">You have no access to this board.</div>
  }

  renderLoading(){
      return (<span>Loading...</span>);
  }

  render () {
    if (!this.state.hasBoardPermissions) {
      return this.renderForbidden()
    }
    if (this.state.leftCard == null || this.state.rightCard == null) {
      return this.renderLoading()
    }
    if (this.state.ended) {
      return (<PrioritizationEnd/>)
    }
    return (
      <ChoicesView
        roomVoters={[]}
        leftCard={this.state.leftCard}
        rightCard={this.state.rightCard}
        everybodyVoted={this.state.voters.left.length + this.state.voters.right.length > 0}
        voters={this.state.voters}
        handleAddToBlacklist={null}
        handleCardClicked={this.handleCardClicked}
        handleGoToNextVoting={() => {}}
        progress={0}
      />
    )
  }
}

export default Choices