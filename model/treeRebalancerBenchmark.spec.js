import treeNodeFactory from "./treeNodeFactory"
import traverseTree from "./traverseTree"
import treeRebalancer from "./treeRebalancer"
import {shuffle} from "lodash"

describe('treeNodeFactoryBenchmark', () => {


  function executeOrdering (applyRebalance, cycles = 100) {
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

    console.log("Tree ordered in " + (sumSteps / cycles) + "steps on average " +
      ( applyRebalance ? "with" : "without") + " rebalance");

    return sumSteps;
  }

  // Try also with very small tree. Example: 2-nodes
  it('should be faster with rebalancing', () => {
    let stepsWithoutRebalancing = executeOrdering(false);
    let stepsWithRebalancing =  executeOrdering(true);
    expect(stepsWithoutRebalancing).toBeGreaterThanOrEqual(stepsWithRebalancing);
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