import treeNodeFactory from "./treeNodeFactory"
import traverseTree from "./traverseTree"
import treeRebalancer from "./treeRebalancer"
import {shuffle} from "lodash"

describe('treeNodeFactoryBenchmark', () => {


  function executeOrdering (applyRebalance, cycles) {
    var sumSteps = 0;
    for (var r = 0; r < cycles; r++) {
      var nodes = [];
      for (var i = 1; i <= 50; i++) {
        nodes.push(treeNodeFactory(i));
      }
      nodes = shuffle(nodes);

      var [reorderedNodesArray, steps] = buildAndReorderTree(nodes, applyRebalance);

      sumSteps += steps;
    }
    return sumSteps;
  }

  // Try also with very small tree. Example: 2-nodes
  it('should be slower without rebalancing', () => {
    let applyRebalance = false;
    let cycles = 100

    var sumSteps = executeOrdering(applyRebalance, cycles);
    console.log("Tree ordered in " + (sumSteps / cycles) + "steps on average without rebalance");
  });

  it('should be faster with rebalancing', () => {
    let applyRebalance = true;
    let cycles = 100

    var sumSteps = executeOrdering(applyRebalance, cycles);
    console.log("Tree ordered in " + (sumSteps / cycles) + "steps on average with rebalance");
  });

  function buildAndReorderTree (nodes, applyRebalance) {

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
        if (applyRebalance) {
          rootNode = treeRebalancer(rootNode)
        }
        choicesCycle(currNode + 1);
      } else {
        getChoice(node, compareNode, currNode);
      }
    }

    var reorderedNodesArray = [];

    function choicesCycle (currNode) {
      if (currNode < nodes.length) {
        getChoice(nodes[currNode], rootNode, currNode);
      } else {
        var reorderedNodes = traverseTree(rootNode);
        for (var j = 0; j < reorderedNodes.length; j++) {
          reorderedNodesArray.push(reorderedNodes[j].value);
        }
      }
    }

    choicesCycle(1);
    return [reorderedNodesArray, steps];
  }

});