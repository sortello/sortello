import treeNodeFactory from "./treeNodeFactory"
import traverseTree from "./traverseTree"
import treeRebalancer from "./treeRebalancer"
import {shuffle} from "lodash"

describe('treeNodeFactory', () => {
  it('should set the correct value to the node', () => {
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
    var nodes = shuffle([
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
      treeNodeFactory(20),
    ]);

    var rootNode = nodes[0];

    function getChoice (node, compareNode, currNode) {

      if (node.value < compareNode.value) {
        compareNode = node.goLeft(compareNode);
      } else {
        compareNode = node.goRight(compareNode);
      }

      if (node.isPositioned) {
        choicesCycle(currNode + 1);
      } else {
        getChoice(node, compareNode, currNode);
      }

    }

    function choicesCycle (currNode) {
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

  it('should build and reorder the nodes correctly when using tree rebalance', () => {
    var nodes = shuffle([
      treeNodeFactory(1),
      treeNodeFactory(2),
      treeNodeFactory(3),
      treeNodeFactory(4),
      treeNodeFactory(5),
    ]);

    var rootNode = nodes[0];

    function getChoice (node, compareNode, currNode) {

      if (node.value < compareNode.value) {
        compareNode = node.goLeft(compareNode);
      } else {
        compareNode = node.goRight(compareNode);
      }

      if (node.isPositioned) {
        rootNode = treeRebalancer(rootNode)
        choicesCycle(currNode + 1);
      } else {
        getChoice(node, compareNode, currNode);
      }

    }

    function choicesCycle (currNode) {
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

  })
})