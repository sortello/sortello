import treeNodeFactory from "./treeNodeFactory"
import traverseTree from "./traverseTree"
import treeRebalancer from "./treeRebalancer"
import {shuffle} from "lodash"

describe('treeNodeFactory', () => {

  // Try also with very small tree. Example: 2-nodes
  it('should be slower without rebalancing', () => {
    var nodes = [];
    for (var i = 1; i <= 20; i++) {
      nodes.push(treeNodeFactory(i));
    }

    nodes = shuffle(nodes);

    var rootNode = nodes[0];
    var steps = 0;
    function getChoice (node, compareNode, currNode) {
      steps++;
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
        console.log("Tree ordered in " + steps + "steps");
        // expect(reorderedNodesArray).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
      }
    }

    choicesCycle(1);

  })

  it('should be faster with rebalancing', () => {
    var nodes = [];
    for (var i = 1; i <= 20; i++) {
      nodes.push(treeNodeFactory(i));
    }

    nodes = shuffle(nodes);

    var rootNode = nodes[0];

    var steps = 0;
    function getChoice (node, compareNode, currNode) {
      steps++;

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
          console.log("Tree ordered in " + steps + "steps");
      }
    }

    choicesCycle(1);

  })
})