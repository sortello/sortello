import React from 'react';
import {clone} from 'lodash'
import io from 'socket.io-client';
import queryString from 'query-string';
import PrioritizationEnd from './PrioritizationEnd.jsx'
import ChoicesView from './view/ChoicesView.jsx'
import AccessdeniedAnimation from './AccessdeniedAnimation.jsx';


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
            voters: {left: [], right: []},
            hasVoted: false,
            hasBoardPermissions: false,
            selectedSide: null,
            roomVoters: []
        }
        if (params.roomKey !== undefined) {
            this.setUpRoom(component);
        }
        if (socket) {
            this.setUpSocket(component);
        }
    }

    setUpSocket (component) {
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
                hasVoted: false,
                selectedSide: null
            })
        })

        socket.on('roomVotersUpdated', function (roomVoters) {
            component.setState({
                roomVoters: roomVoters
            })
        })

        socket.on('prioritizationEnded', function () {
            component.setState({
                ended: true
            })
        })
    }

    setUpRoom (component) {
        component.state.roomId = params.roomKey
        if (socket) {
            component.room = new Room(socket, params.roomKey);
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
                component.room.leave(component.trelloId)
            });
        }
    }

    handleCardClicked (side) {
        if (!this.state.hasVoted && this.room) {
            this.room.castCardClicked(side, this.trelloId, this.trelloAvatar)
        }
        this.setState({
            hasVoted: true,
            selectedSide: side
        })
    }

    renderForbidden () {
        return  <div>
                    <div className="no-access-message__container">
                        <AccessdeniedAnimation />
                        <div id="forbidden-div" className="no-access-message__heading">Ooops!</div>
                <div className="no-access-message__paragraph">You have no access to this board, please contact board's administrator to gain access.</div>
                    </div>
                </div>
    }

    renderLoading () {
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
                roomVoters={this.state.roomVoters}
                leftCard={this.state.leftCard}
                rightCard={this.state.rightCard}
                everybodyVoted={this.state.voters.left.length + this.state.voters.right.length > 0}
                voters={this.state.voters}
                handleAddToBlacklist={null}
                handleCardClicked={this.handleCardClicked}
                progress={0}
                selectedSide={this.state.selectedSide}
                role="voter"
            />
        )
    }
}

export default Choices
