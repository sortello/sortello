import Room from "./Room"
import {shuffle} from "lodash"

describe('Room', () => {
    it("should set the correct socket to the room", () =>{
        const socket = "socket";
        const roomKey = "123";
        const room = new Room(socket,roomKey);
        expect(room.socket).toBe(socket);
    })

    it("should set the correct id to the room", () =>{
        const socket = "socket";
        const roomKey = "123";
        const room = new Room(socket,roomKey);
        expect(room.roomKey).toBe(roomKey);
    })

    it('should add voters', () => {
        const socket = { emit : jest.fn() }
        const roomKey = "123"
        let room = new Room (socket,roomKey)
        let spy = spyOn(room,'castRoomVoters').and.returnValue(42);
        room.addVoter("voterId","trelloAvatar");
        expect(room.roomVoters).toEqual([{
            id: "voterId",
            avatar: "trelloAvatar"
        }])
        expect(spy).toHaveBeenCalled();
        spy.calls.reset();

        room.addVoter("voterId2","trelloAvatar2");
        expect(room.roomVoters).toEqual([{
            id: "voterId",
            avatar: "trelloAvatar"
        },{
            id:"voterId2",
            avatar:"trelloAvatar2"
        }])
        expect(spy).toHaveBeenCalled();
        spy.calls.reset();
    })


    it('should not add voters if voterId already exists',() => {
        const socket = {emit: jest.fn()}
        const roomKey = "123"
        let room = new Room (socket,roomKey)
        let spy = spyOn(room,'castRoomVoters').and.returnValue(42);
        room.addVoter("voterId","trelloAvatar")
        expect(spy).toHaveBeenCalled();
        spy.calls.reset()
        room.addVoter("voterId","trelloAvatar2")
        expect(room.roomVoters).toHaveLength(1);
        expect(spy).not.toHaveBeenCalled();
    })

    it("updates state after everybody has voted", () => {
        const socket = {emit: jest.fn()}
        const roomKey = "123"
        let room = new Room (socket,roomKey)
        room.addVoter("voterId","trelloAvatar");
        room.addVoter("voterId2","trelloAvatar2");
        room.addVoter("voterId3","trelloAvatar3");
        room.registerVote("node","voter0",""); // Room opener does not count as room voter ATM
        expect(room.voters.left).toHaveLength(1)
        room.registerVote("node","voterId","trelloAvatar");
        expect(room.voters.left).toHaveLength(2)
        expect(room.everybodyVoted).toBe(false)
        room.registerVote('node', 'voterId2', 'trelloAvatar2')
        expect(room.voters.left).toHaveLength(3)
        expect(room.everybodyVoted).toBe(false)
        room.registerVote('compareNode', 'voterId3', 'trelloAvatar3')
        expect(room.voters.right).toHaveLength(1)
        expect(room.voters.left).toHaveLength(3)
        expect(room.everybodyVoted).toBe(true)
    })
    
})