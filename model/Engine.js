import treeRebalancer from "../model/treeRebalancer";
import {clone} from "lodash"

class Engine {

  constructor(listNodes, rootNode){
    this.listNodes = listNodes;
    this.rootNode = rootNode;
    this.initialState = {
      listNodes : clone(listNodes),
      rootNode : clone(rootNode)
    }
  }

  resetToInitialState(){
    this.listNodes = clone(this.initialState.listNodes);
    this.rootNode = clone(this.initialState.rootNode);
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