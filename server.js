const io = require('socket.io')();

let rooms = [
  {
    roomKey : '123n123eih12he',
    clients: {}
  }
]

io.on('connection', (client) => {
  client.on('openNewRoom', () => {
    console.log('A client requested to open a new Room');
    client.emit('newRoomOpened', '?roomKey=123n123eih12he')
  });
});


const port = 8000;
io.listen(port);
console.log('listening on port ', port);