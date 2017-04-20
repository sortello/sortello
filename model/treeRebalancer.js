import traverseTree from "./traverseTree"
import treeNodeFactory from "./treeNodeFactory"

export default unbalancedTree => {
  var orderedNodes = traverseTree(unbalancedTree);
  var readableReorderedNodesArray = [];
  var reorderedNodesArray = [];
  for (var j = 0; j < orderedNodes.length; j++) {
    reorderedNodesArray.push(treeNodeFactory(orderedNodes[j].value));
    readableReorderedNodesArray.push(orderedNodes[j].value.name);
  }

  function rebuildTree (orderedNodes) {
    if (orderedNodes.length === 1) {
      return orderedNodes[0]
    }

    if (orderedNodes.length === 0) {
      return null
    }

    var numNodes = orderedNodes.length;
    var rootNodeIndex = Math.ceil(numNodes / 2) - 1;
    var rootNode = orderedNodes[rootNodeIndex];

    rootNode.left = rebuildTree(orderedNodes.slice(0, rootNodeIndex));
    rootNode.right = rebuildTree(orderedNodes.slice(rootNodeIndex + 1));
    return rootNode;
  }

  var balancedTree = rebuildTree(reorderedNodesArray);

  return balancedTree;
}