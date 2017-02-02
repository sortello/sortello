import treeNodeFactory from "./treeNodeFactory"
import traverseTree from "./traverseTree"

describe('treeNodeFactory',() => {
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

    })
})