import React from "react";
import Header from './Header.jsx';
import TreeDraw from './TreeDraw.jsx';
import Card from './Card.jsx';
import Footer from "./Footer.jsx"
import {clone} from "lodash"
import Engine from "../model/Engine.js"

class Choices extends React.Component {

  constructor (props) {

    super(props);
    this.engine = new Engine(clone(this.props.nodes), clone(this.props.rootNode));
    this.state = this.getInitialState();
    this.componentDidMount = this.componentDidMount.bind(this)
    this.autoChoice = this.autoChoice.bind(this)
    this.handleCardClicked = this.handleCardClicked.bind(this)
    this.cardClicked = this.cardClicked.bind(this)
    this.addToBlacklist = this.addToBlacklist.bind(this)
    this.popWithAutochoices = this.popWithAutochoices.bind(this)
    this.endChoices = this.endChoices.bind(this)
    this.executeReplay = this.executeReplay.bind(this)
    this.toTheNextStep = this.toTheNextStep.bind(this)
    this.clearPositioned = this.clearPositioned.bind(this)
    this.setReplay = this.setReplay.bind(this)
    this.undo = this.undo.bind(this)
    this.clearPositioned = this.clearPositioned.bind(this)
    this.nextStepOrEnd = this.nextStepOrEnd.bind(this)
    this.startChoices = this.startChoices.bind(this)
  }

  getInitialState () {
    return {
      leftCard: null,
      rightCard: null,
      progress: 0
    }
  }

  componentDidMount () {
    window.actionsHistory = [];
  }

  endChoices () {
    this.props.setSortedRootNode(this.engine.getRootNode());
  }

  executeReplay () {
    const nextAction = this.engine.getNextReplayAction();
    nextAction.f(nextAction.p);
  }

  autoChoice () { // Auto-click forgotten card
    if (this.engine.getReplay().length > 0) {
      this.executeReplay();
    } else {
      if (this.engine.getBlackList().indexOf(this.state.leftCard.value.id) > -1) {
        this.cardClicked("right", "auto");
      }
      else if (this.engine.getBlackList().indexOf(this.state.rightCard.value.id) > -1) {
        this.cardClicked("left", "auto");
      }
    }
  }

  addToBlacklist (nodeId) {
    this.engine.addToBlackList(nodeId);
    this.autoChoice();
  }

  handleCardClicked (side) {
    if (this.engine.getReplay().length === 0) {
      this.cardClicked(side, "human");
    }
  }

  cardClicked (side, source) {
    if ("left" == side) {
      this.engine.goLeft();
    }
    else if ("right" == side) {
      this.engine.goRight();
    }
    window.actionsHistory.push({f: this.cardClicked, p: side, s: source})
    this.handleCardPositioned();
  }

  toTheNextStep () {
    this.engine.rebalanceTree();
    this.setState({
      progress: Math.round(((100 * (this.props.nodes.length - this.engine.getListNodes().length)) / (this.props.nodes.length)))
    }, function () {
      this.nextStepOrEnd();
    });
  }

  handleCardPositioned () {
    if (this.engine.getNode().isPositioned) {
      this.toTheNextStep();
    } else {
      this.getNextChoice();
    }
  }

  nextStepOrEnd () {
    if(this.engine.nextStep()){
      this.getNextChoice();
    }else{
      this.endChoices();
    }
  }

  getNextChoice () {
    this.setState({
      leftCard: this.engine.getNode(),
      rightCard: this.engine.getCompareNode()
    }, function () {
      this.autoChoice();
    });
  }

  startChoices () {
    this.props.setStartTimeStamp(Date.now())
    this.nextStepOrEnd();
  }

  clearPositioned (cb) {
    this.engine.clearPositioned();
    cb();
  }

  popWithAutochoices () {
    let previousAction = window.actionsHistory.pop();
    while (previousAction.s === "auto") {
      previousAction = window.actionsHistory.pop();
    }
  }

  setReplay () {
    this.popWithAutochoices();
    let comp = this;
    this.engine.setReplay(clone(window.actionsHistory));
    comp.clearPositioned(function () {
      window.actionsHistory = [];
      comp.nextStepOrEnd();
    });
  }

  undo () {
    if (window.actionsHistory.length > 0) {
      this.engine.undo();
      this.setReplay()
    }
  }

  render () {
    if (this.state.leftCard == null || this.state.rightCard == null) {
      return (<span>Loading...</span>);
    }
    return (
      <div id="second_div">
        <div className="container__choose-card">
          <div className="choose-card__heading">Select the highest priority card</div>
          <Card id="left_button" side="left" handleClick={this.handleCardClicked}
                forget={this.addToBlacklist} data={this.state.leftCard.value}/>
          <Card id="right_button" side="right" handleClick={this.handleCardClicked}
                forget={this.addToBlacklist} data={this.state.rightCard.value}/>
          {/*<TreeDraw tree={this.state.rootNode}></TreeDraw>*/}

          <button onClick={() => this.undo()} id="undo_button" className="normalize__undo-button">
            <div className="undo__button">
              <div className="undo__icon">
                <img src="assets/icons/undo-icon.svg" alt=""/>
                Undo choice
              </div>
            </div>

          </button>

        </div>
        <div className="container__prioritization-status">
          <div className="text__prioritization-status">Prioritization progress</div>
          <div className={"progressive-bar__status-structure"}>
            <div className={"progressive-bar__status"} role="progressbar" aria-valuenow={this.state.progress}
                 aria-valuemin="0"
                 aria-valuemax="100" style={{width: this.state.progress + '%'}}>
            </div>
          </div>
        </div>
        <div className={"logout__button"}>
          <Header/>
        </div>
        <div className={"footer"}>
          <Footer/>
        </div>

      </div>
    )
  }
}

export default Choices
