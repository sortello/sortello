import treeRebalancer from "../model/treeRebalancer";
import {clone} from "lodash"

class Engine {

  constructor(listNodes, rootNode){
    this.listNodes = listNodes;
    this.rootNode = rootNode;
    this.compareNode = null
    this.node = null
    this.blackList = []
    this.initialState = {
      listNodes : clone(listNodes),
      rootNode : clone(rootNode),
      compareNode : null,
      node : null,
      blackList : []
    }
  }

  resetToInitialState(){
    this.listNodes = clone(this.initialState.listNodes);
    this.rootNode = clone(this.initialState.rootNode);
    this.compareNode = clone(this.initialState.compareNode);
    this.node = clone(this.initialState.node);
    this.blackList = clone(this.initialState.blackList);
  }

  undo(){
    this.resetToInitialState();
  }

  addToBlackList(nodeId){
    this.blackList.push(nodeId);
  }

  getBlackList(){
    return this.blackList;
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