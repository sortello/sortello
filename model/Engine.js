import treeRebalancer from "../model/treeRebalancer";
import {clone} from "lodash"

class Engine {

  constructor(listNodes, rootNode){
    this.listNodes = listNodes;
    this.rootNode = rootNode;
    this.comparenode = null
    this.initialState = {
      listNodes : clone(listNodes),
      rootNode : clone(rootNode),
      compareNode : null
    }
  }

  resetToInitialState(){
    this.listNodes = clone(this.initialState.listNodes);
    this.rootNode = clone(this.initialState.rootNode);
    this.compareNode = clone(this.initialState.compareNode);
  }

  getListNodes(){
    return this.listNodes;
  }

  getRootNode(){
    return this.rootNode;
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