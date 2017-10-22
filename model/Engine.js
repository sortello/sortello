import treeRebalancer from "../model/treeRebalancer";
import {clone} from "lodash"

class Engine {

  constructor (listNodes, rootNode) {
    this.listNodes = listNodes;
    this.rootNode = rootNode;
    this.compareNode = null
    this.node = null
    this.blackList = []
    this.replay = []
    window.actionsHistory = []
    this.initialState = {
      listNodes: clone(listNodes),
      rootNode: clone(rootNode),
      compareNode: null,
      node: null,
      blackList: [],
      replay: []
    }
  }

  resetToInitialState () {
    this.listNodes = clone(this.initialState.listNodes);
    this.rootNode = clone(this.initialState.rootNode);
    this.compareNode = clone(this.initialState.compareNode);
    this.node = clone(this.initialState.node);
    this.blackList = clone(this.initialState.blackList);
    this.replay = clone(this.initialState.replay);
  }

  popWithAutochoices(){
    let previousAction = window.actionsHistory.pop();
    while (previousAction.s === "auto") {
      previousAction = window.actionsHistory.pop();
    }
  }

  getActionsHistory(){
    return window.actionsHistory
  }

  clearActionsHistory(){
    window.actionsHistory = []
  }

  setActionsHistory(history){
    window.actionsHistory = history
  }

  addToHistory(item){
    window.actionsHistory.push(item)
  }

  popActionsHistory(){
    return window.actionsHistory.pop()
  }

  nextStep () {
    if (0 < this.listNodes.length) {
      this.compareNode = this.rootNode
      this.node = this.getNextNode();
      return true;
    }
    return false;
  }

  goLeft () {
    this.compareNode = this.node.goLeft(this.compareNode);
  }

  goRight () {
    this.compareNode = this.node.goRight(this.compareNode);
  }

  setReplay () {
    this.replay = clone(window.actionsHistory);
  }

  getReplay () {
    return this.replay;
  }

  getNextReplayAction () {
    return this.replay.shift()
  }

  undo () {
    this.resetToInitialState();
  }

  addToBlackList (nodeId) {
    this.blackList.push(nodeId);
  }

  getBlackList () {
    return this.blackList;
  }

  getListNodes () {
    return this.listNodes;
  }

  getRootNode () {
    return this.rootNode;
  }

  getNode () {
    return this.node;
  }

  getNextNode () {
    return this.listNodes.shift();
  }

  getCompareNode () {
    return this.compareNode
  }

  setCompareNode (compareNode) {
    this.compareNode = compareNode
  }

  setNode (node) {
    this.node = node
  }

  clearPositioned () {
    for (let i = 0; i < this.listNodes.length; i++) {
      this.listNodes[i].isPositioned = false;
    }
  }

  rebalanceTree () {
    this.rootNode = treeRebalancer(this.rootNode);
  }
}

export default Engine;