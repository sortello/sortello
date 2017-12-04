import traverseTree from "./traverseTree"
import treeRebalancer from "./treeRebalancer"

describe('treeNodeFactory', () => {

  it('builds an equivalent tree', () => {

    var tree = {
      left: {
        left: {
          left: null,
          right: {
            left: null,
            right: null,
            value: 'a',
            isPositioned: false
          },
          value: 'b',
          isPositioned: false
        },
        right: {
          left: null,
          right: null,
          value: 'c',
          isPositioned: false
        },
        value: 'd',
        isPositioned: false
      },
      right: {
        left: {
          left: null,
          right: null,
          value: 'e',
          isPositioned: false
        },
        right: {
          left: {
            left: {
              left: null,
              right: null,
              value: 'f',
              isPositioned: false
            },
            right: null,
            value: 'g',
            isPositioned: false
          },
          right: null,
          value: 'h',
          isPositioned: false
        },
        value: 'i',
        isPositioned: false
      },
      value: 'l',
      isPositioned: false
    };

    var rebalancedTree = treeRebalancer(tree);
    var traversedTreeElements = getArray(traverseTree(tree));
    var traversedBalancedTreeElements = getArray(traverseTree(rebalancedTree));

    expect(traversedTreeElements).toEqual(traversedBalancedTreeElements);

    });

    function getArray(nodes){
      var results = [];
      for(var i=0; i< nodes.length; i++){
        results.push(nodes[i].value);
      }
      return results;

    }

});