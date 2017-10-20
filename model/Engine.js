import treeRebalancer from "../model/treeRebalancer";
import {clone} from "lodash"

class Engine {

  constructor(listNodes, rootNode){
    this.listNodes = listNodes;
    this.rootNode = rootNode;
    this.compareNode = null
    this.node = null
    this.initialState = {
      listNodes : clone(listNodes),
      rootNode : clone(rootNode),
      compareNode : null,
      node : null
    }
  }

  resetToInitialState(){
    this.listNodes = clone(this.initialState.listNodes);
    this.rootNode = clone(this.initialState.rootNode);
    this.compareNode = clone(this.initialState.compareNode);
    this.node = clone(this.initialState.node);
  }

  getListNodes(){
    return this.listNodes;
  }

  getRootNode(){
    return this.rootNode;
  }

  getNode(){
    return this.node;
  }

  getNextNode(){
    return this.listNodes.shift();
  }

  getCompareNode(){
    return this.compareNode
  }

  setCompareNode(compareNode){
    this.compareNode = compareNode
  }

  setNode(node){
    this.node = node
  }

  clearPositioned(){
    for (let i = 0; i < this.listNodes.length; i++) {
      this.listNodes[i].isPositioned = false;
    }
  }

  rebalanceTree(){
    this.rootNode = treeRebalancer(this.rootNode);
  }
}

export default Engine;