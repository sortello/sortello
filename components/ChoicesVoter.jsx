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
    this.handleCardClicked = this.handleCardClicked.bind(this)

    this.state = {
      leftCard: null,
      rightCard: null,
      ended: false,
      leftVoters: [],
      rightVoters: [],
      hasVoted: false
    }
    let component = this

    if (params.roomKey !== undefined) {
      this.state.roomId = params.roomKey

      //client joins the room
      socket.on('connect', function () {
        console.log("connecting to room");
        socket.emit('room', params.roomKey);
        socket.emit('getCurrentChoice', params.roomKey);
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

  handleCardClicked (side) {
    if(!this.state.hasVoted){
      socket.emit('cardClicked', side, this.state.roomId)
    }
    this.setState({
      hasVoted: true
    })
  }

  render () {
    if (this.state.leftCard == null || this.state.rightCard == null) {
      return (<span>Loading...</span>);
    }
    if(this.state.ended){
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
