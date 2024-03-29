import React from "react";
import Card from './Card.jsx';
import {clone} from "lodash"
import Engine from "../model/Engine.js"
import {find} from "lodash"
import {findIndex} from "lodash"
import ChoicesView from './view/ChoicesView.jsx'

function openOverlay() {
    document.getElementById('overlay__share-room').style.height = "100%";
    document.getElementById('overlay__share-room').style.opacity = "1";
}

const getRandomKey = () => {
    let randomKey = '';
    let chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    for (let i = 32; i > 0; --i) randomKey += chars[Math.floor(Math.random() * chars.length)];
    return randomKey
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
        this.removeVoter = this.removeVoter.bind(this)
        this.addVoter = this.addVoter.bind(this)
        this.registerVote = this.registerVote.bind(this)
        this.addVoteToVoters = this.addVoteToVoters.bind(this)
        this.getTrelloUserData(this);
        this.getAllRoomVoters = this.getAllRoomVoters.bind(this)
        this.castRoomVoters = this. castRoomVoters.bind(this)
        this.room = false;
        this.state = {
            leftCard: null,
            rightCard: null,
            roomId: null,
            voters: {left: [], right: []},
            roomVoters: [],
            everybodyVoted: false,
            selectedSide: null
        }
    }

    getTrelloUserData (component) {
        component.props.Trello.members.get('me', {}, function (data) {
            component.trelloId = data.id
        }, function (e) {
            console.log(e);
        });
    }

    addVoteToVoters (side, voter) {
        let component = this
        if ('node' === side) {
            let lv = component.state.voters.left.concat(voter);
            component.setState({
                voters: {
                    left: lv,
                    right: component.state.voters.right,
                }
            }, function () {
                component.checkTotalVotes()
            })
        }
        if ('compareNode' === side) {
            let rv = component.state.voters.right.concat(voter);
            component.setState({
                voters: {
                    left: component.state.voters.left,
                    right: rv,
                }
            }, function () {
                component.checkTotalVotes()
            })
        }
    }

    registerVote (side, trelloId, trelloAvatar) {
        let voter = {
            voterId: trelloId,
            trelloId: trelloId,
            trelloAvatar: trelloAvatar
        }

        this.addVoteToVoters(side, voter)

    }

    checkTotalVotes () {
        let component = this;
        if (this.state.roomVoters.length == 0) {
            return
        }

        if ((this.state.voters.left.length + this.state.voters.right.length) >= 1 + this.state.roomVoters.length) {
            this.setState({
                everybodyVoted: true
            }, function () {
                if (component.room) {
                    component.room.castVotesInfo(component.state.voters.left, component.state.voters.right)
                }
            })
        }
    }

    castRoomVoters () {
        this.room.castRoomVoters(this.getAllRoomVoters())
    }

    removeVoter (voterId) {
        let component = this
        if (find(component.state.roomVoters, {'id': voterId}) === undefined) {
            return
        }
        let newVoters = component.state.roomVoters.slice(); //copy array
        let index = findIndex(newVoters, function (item) {
            return item.id === voterId
        })
        newVoters.splice(index, 1); //remove element
        component.setState({
            roomVoters: newVoters
        }, () => {
            component.castRoomVoters()
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
        }, () => {
            component.castRoomVoters()
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
            everybodyVoted: false
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
                voters: {left: [], right: []},
                selectedSide: null
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
            hasVoted: true,
            selectedSide: component.room ? side : null
        })

        this.addVoteToVoters(side, voter)
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

    renderLoading () {
        return (<div><span>Loading...</span></div>)
    }

    getAllRoomVoters () {
        let joinedVoters = this.state.roomVoters
        if (this.room) {
            joinedVoters = joinedVoters.concat({
                id: this.trelloId,
                avatar: this.trelloAvatar,
                isAdmin: true
            })
        }

        return joinedVoters
    }

    render () {

        if (this.state.leftCard == null || this.state.rightCard == null) {
            this.renderLoading()
        }


        return (
            <ChoicesView
                roomVoters={this.getAllRoomVoters()}
                leftCard={this.state.leftCard}
                rightCard={this.state.rightCard}
                everybodyVoted={this.state.everybodyVoted}
                voters={this.state.voters}
                handleAddToBlacklist={this.handleAddToBlacklist}
                handleCardClicked={this.handleCardClicked}
                handleUndoClicked={this.handleUndoClicked}
                progress={this.getProgress()}
                selectedSide={this.state.selectedSide}
            />
        )
    }
}

export default Choices
