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

    /*it('should set the correct value to the node', () => {
        const VALUE = "THIS IS SPARTA"
        const result = treeNodeFactory(VALUE)
        expect(result.value).toBe(VALUE)
    })

    it('should count the nodes of the tree', () => {
        var nodeOne = treeNodeFactory('node one');
        var nodeTwo = treeNodeFactory('node two');
        var nodeThree = treeNodeFactory('node three');
        var nodeFour = treeNodeFactory('node four');
        var nodeFive = treeNodeFactory('node five');

        var rootNode = treeNodeFactory('root node');
        nodeFour.right = nodeFive;
        nodeThree.left = nodeFour;
        nodeOne.left = nodeThree;
        nodeOne.right = nodeTwo;
        rootNode.left = nodeOne;

        expect(traverseTree(rootNode).length).toBe(6);

    });

    // Try also with very small tree. Example: 2-nodes
    it('should build and reorder the nodes correctly', () => {
        let nodes = shuffle([
            treeNodeFactory(1),
            treeNodeFactory(2),
            treeNodeFactory(3),
            treeNodeFactory(4),
            treeNodeFactory(5),
            treeNodeFactory(6),
            treeNodeFactory(7),
            treeNodeFactory(8),
            treeNodeFactory(9),
            treeNodeFactory(10),
            treeNodeFactory(11),
            treeNodeFactory(12),
            treeNodeFactory(13),
            treeNodeFactory(14),
            treeNodeFactory(15),
            treeNodeFactory(16),
            treeNodeFactory(17),
            treeNodeFactory(18),
            treeNodeFactory(19),
            treeNodeFactory(20)
        ]);

        var rootNode = nodes[0];

        function getChoice(node, compareNode, currNode) {

            compareNode = choose(node, compareNode);

            if (node.isPositioned) {
                choicesCycle(currNode + 1);
            } else {
                getChoice(node, compareNode, currNode);
            }

        }

        function choicesCycle(currNode) {
            if (currNode < nodes.length) {
                getChoice(nodes[currNode], rootNode, currNode);
            } else {
                var reorderedNodes = traverseTree(rootNode);
                var reorderedNodesArray = [];
                for (var j = 0; j < reorderedNodes.length; j++) {
                    reorderedNodesArray.push(reorderedNodes[j].value);
                }
                expect(reorderedNodesArray).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
            }
        }

        choicesCycle(1);

    })

    function choose(node, compareNode) {
        if (node.value < compareNode.value) {
            compareNode = node.goLeft(compareNode);
        } else {
            compareNode = node.goRight(compareNode);
        }
        return compareNode;
    }

    it('should build and reorder the nodes correctly when using tree rebalance', () => {
        let nodes = shuffle([
            treeNodeFactory(1),
            treeNodeFactory(2),
            treeNodeFactory(3),
            treeNodeFactory(4),
            treeNodeFactory(5)
        ]);

        let rootNode = nodes[0];

        function getChoice(node, compareNode, currNode) {

            compareNode = choose(node, compareNode);

            if (node.isPositioned) {
                rootNode = treeRebalancer(rootNode)
                choicesCycle(currNode + 1);
            } else {
                getChoice(node, compareNode, currNode);
            }

        }

        function choicesCycle(currNode) {
            if (currNode < nodes.length) {
                getChoice(nodes[currNode], rootNode, currNode);
            } else {
                var reorderedNodes = traverseTree(rootNode);
                var reorderedNodesArray = [];
                for (var j = 0; j < reorderedNodes.length; j++) {
                    reorderedNodesArray.push(reorderedNodes[j].value);
                }
                expect(reorderedNodesArray).toEqual([1, 2, 3, 4, 5]);
            }
        }

        choicesCycle(1);

    })*/
})