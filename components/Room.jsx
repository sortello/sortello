import React from "react";
import openSocket from 'socket.io-client';
import queryString from "query-string";

const socket = openSocket('http://localhost:8000');
const params = queryString.parse(location.search);

class Room extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      'people': [
        {'name': 'pippo'},
        {'name': 'pluto'}
      ],
      'timestamp': 'no timestamp yet',
      'roomKey': 'roomIsNotOpen'
    }
    this.createRoom = this.createRoom.bind(this)

    if (params.roomKey !== undefined){
      socket.emit('enterRoom', params.roomKey)
      socket.on('enteredRoom', choiceItems => {
        this.props.becomeVoter(choiceItems);
      })
    }

  }

  createRoom () {
    let component = this
    console.log("emitting openNewRoom event");
    socket.emit('openNewRoom')
      socket.on('newRoomOpened', roomKey => {
        console.log(roomKey);
        component.setState( {
          roomKey: roomKey
        })
      })
  }

  render () {
    return (
      <div>
        Connected Users:
        {this.state.people.map((person, index) => (
          <p key={index}>{person.name}</p>
        ))}
        <p className="App-intro">
          This is the timer value: {this.state.timestamp}
        </p>
        <p className="App-intro">
          RoomKey: {this.state.roomKey}
        </p>
        <button onClick={this.createRoom}>Open new room</button>
      </div>
    )
  }
}

export default Room