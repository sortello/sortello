import React from "react";
import Header from './Header.jsx';
import TreeDraw from './TreeDraw.jsx';
import Card from './Card.jsx';
import Footer from "./Footer.jsx"
import {clone} from "lodash"
import io from 'socket.io-client';
import queryString from "query-string";

const socket = io('http://localhost:8000/');
const params = queryString.parse(location.search);

class Choices extends React.Component {

  constructor (props) {
    super(props);
    let component = this
    this.handleCardClicked = this.handleCardClicked.bind(this)
    this.Trello = this.props.Trello


    this.state = {
      leftCard: null,
      rightCard: null,
      ended: false,
      leftVoters: [],
      rightVoters: [],
      hasVoted: false
    }

    if (params.roomKey !== undefined) {
      console.log(component.trelloId)
      component.state.roomId = params.roomKey
      socket.on('connect', function () {
        console.log("connecting to room");
        component.props.Trello.members.get('me', {}, function (data) {
          console.log(data)
          component.trelloId = data.id

          component.trelloAvatar = '//trello-avatars.s3.amazonaws.com/' + data.avatarHash + '/50.png'
          if(data.avatarHash === null){
            component.trelloAvatar = '//www.gravatar.com/avatar/' + data.gravatarHash + '?s=64&d=identicon'
          }
          socket.emit('room', params.roomKey, component.trelloId, component.trelloAvatar);
          socket.emit('getCurrentChoice', params.roomKey);
        }, function (e) {
          console.log(e);
        });
      });
    }





    // socket.on('cardClicked', function (room) {
    //   console.log("somebody clicked a card in room " + room)
    // })

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


  connect(){

  }

  handleCardClicked (side) {
    if (!this.state.hasVoted) {
      socket.emit('cardClicked', side, this.state.roomId, this.trelloId, this.trelloAvatar)
    }
    this.setState({
      hasVoted: true
    })
  }

  render () {
    if (this.state.leftCard == null || this.state.rightCard == null) {
      return (<span>Loading...</span>);
    }
    if (this.state.ended) {
      return (<div>Prioritization ended. Take a break!</div>)
    }
    return (
      <div id="second_div">
        <div className="container__choose-card">
          <div className="choose-card__heading">Select the highest priority card</div>
          <Card id="left_button" side="node" handleClick={this.handleCardClicked}
                forget={null} data={this.state.leftCard.value} voters={this.state.leftVoters}/>
          <Card id="right_button" side="compareNode" handleClick={this.handleCardClicked}
                forget={null} data={this.state.rightCard.value} voters={this.state.rightVoters}/>
          {/*<TreeDraw tree={this.state.rootNode}></TreeDraw>*/}

        </div>
        <div className={"logout__button"}>
          <Header/>

        </div>
        <div className={"footer"}>
          <Footer/>
        </div>

      </div>
    )
  }
}

export default Choices
