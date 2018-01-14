class Room {

  constructor (socket, roomKey) {
    this.socket = socket
    this.roomKey = roomKey
  }

  open(newRoomKey){
    this.socket.emit('openNewRoom', newRoomKey)
  }

  join (trelloId, trelloAvatar) {
    this.socket.emit('room', this.roomKey, trelloId, trelloAvatar);
  }

  leave (trelloId) {
    this.socket.emit('leaveRoom', this.roomKey, trelloId)
  }

  getBoardId () {
    this.socket.emit('getBoardId', this.roomKey)
  }

  getCurrentChoice () {
    this.socket.emit('getCurrentChoice', this.roomKey);
  }

  castCardClicked (side, trelloId, trelloAvatar) {
    this.socket.emit('cardClicked', side, this.roomKey, trelloId, trelloAvatar)
  }


  // master methods
  castNextChoice (leftCard, rightCard) {
    this.socket.emit('nextChoice', leftCard, rightCard, this.roomKey)
  }

  castBoardId (boardId) {
    this.socket.emit('castBoardId', this.roomKey, boardId)
  }

  castPrioritizationEnded () {
    this.socket.emit('prioritizationEnded', this.roomKey)
  }

  castVotesInfo (leftVoters, rightVoters) {
    this.socket.emit('votesInfo', leftVoters, rightVoters, this.roomKey)
  }

}

export default Room;