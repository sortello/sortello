import treeNodeFactory from "./treeNodeFactory"
import traverseTree from "./traverseTree"
import treeRebalancer from "./treeRebalancer"
import {shuffle} from "lodash"

describe('treeNodeFactoryBenchmark', () => {

  function executeOrdering (applyRebalance, cycles = 100) {
    let sumSteps = 0;
    for (let r = 0; r < cycles; r++) {
      let nodes = [];
      for (let i = 1; i <= 50; i++) {
        nodes.push(treeNodeFactory(i));
      }
      nodes = shuffle(nodes);

      let [reorderedNodesArray, steps] = buildAndReorderTree(nodes, applyRebalance);

      sumSteps += steps;
    }

    console.log("Tree ordered in " + (sumSteps / cycles) + "steps on average " +
      ( applyRebalance ? "with" : "without") + " rebalance");

    return sumSteps;
  }

  // Try also with very small tree. Example: 2-nodes
  it('should be faster with rebalancing', (done) => {
    let stepsWithoutRebalancing = executeOrdering(false);
    let stepsWithRebalancing =  executeOrdering(true);
    expect(stepsWithoutRebalancing).toBeGreaterThanOrEqual(stepsWithRebalancing);
    done()
  });

  function makeChoice (node, compareNode) {
    if (node.value < compareNode.value) {
      compareNode = node.goLeft(compareNode);
    } else {
      compareNode = node.goRight(compareNode);
    }
    return compareNode;
  }

  function buildAndReorderTree (nodes, applyRebalance) {

    let rootNode = nodes[0];
    let steps = 0;

    function getChoice (node, compareNode, currNode) {
      steps++;
      compareNode = makeChoice(node, compareNode);

      if (node.isPositioned) {
        if (applyRebalance) {
          rootNode = treeRebalancer(rootNode)
        }
        choicesCycle(currNode + 1);
      } else {
        getChoice(node, compareNode, currNode);
      }
    }

    let reorderedNodesArray = [];

    function choicesCycle (currNode) {
      if (currNode < nodes.length) {
        getChoice(nodes[currNode], rootNode, currNode);
      } else {
        let reorderedNodes = traverseTree(rootNode);
        for (let j = 0; j < reorderedNodes.length; j++) {
          reorderedNodesArray.push(reorderedNodes[j].value);
        }
      }
    }

    choicesCycle(1);
    return [reorderedNodesArray, steps];
  }

});