class Room {

  constructor (socket, roomKey) {
    this.socket = socket
    this.roomKey = roomKey
  }

  join (trelloId, trelloAvatar) {
    this.socket.emit('room', this.roomKey, trelloId, trelloAvatar);
  }

  leave(trelloId){
    this.socket.emit('leaveRoom', this.roomKey, trelloId)
  }

  getBoardId () {
    this.socket.emit('getBoardId', this.roomKey)
  }

  getCurrentChoice () {
    this.socket.emit('getCurrentChoice', this.roomKey);
  }

  castCardClicked(side, trelloId, trelloAvatar){
    this.socket.emit('cardClicked', side, this.roomKey, trelloId, trelloAvatar)
  }

}

export default Room;