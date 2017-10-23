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
    this.autoChoice = this.autoChoice.bind(this)
    this.handleCardClicked = this.handleCardClicked.bind(this)
    this.cardClicked = this.cardClicked.bind(this)
    this.handleAddToBlacklist = this.handleAddToBlacklist.bind(this)
    this.endChoices = this.endChoices.bind(this)
    this.handleUndo = this.handleUndo.bind(this)
    this.startChoices = this.startChoices.bind(this)

    this.cardToNode = {
      'left': 'node',
      'right': 'compareNode'
    }

    this.state = {
      leftCard: null,
      rightCard: null
    }
  }

  endChoices () {
    this.props.setSortedRootNode(this.engine.getRootNode());
  }

  startChoices () {
    this.props.setStartTimeStamp(Date.now())
    this.engine.nextStepOrEnd();
    this.getNextChoice()
  }

  getNextChoice () {
    if (this.engine.getEnded()) {
      this.endChoices()
      return
    }
    this.setState({
      leftCard: this.engine.getNode(),
      rightCard: this.engine.getCompareNode()
    }, function () {
      this.autoChoice();
    });
  }

  cardClicked (side, source) {
    this.engine.choiceMade(this.cardToNode[side])
    this.engine.addToHistory({f: this.cardClicked, p: side, s: source})
    this.getNextChoice();
  }

  autoChoice () { // Auto-click forgotten card
    if (this.engine.getReplay().length > 0) {
      const nextAction = this.engine.getNextReplayAction();
      nextAction.f(nextAction.p);
    } else {
      if (this.engine.nodeIsBlackListed()) {
        this.cardClicked("right", "auto");
      }
      else if (this.engine.compareNodeIsBlackListed()) {
        this.cardClicked("left", "auto");
      }
    }
  }

  handleUndo () {
    this.engine.undo();
    this.getNextChoice()
  }

  handleAddToBlacklist (nodeId) {
    this.engine.addToBlackList(nodeId);
    this.autoChoice();
  }

  handleCardClicked (side) {
    if (this.engine.getReplay().length === 0) {
      this.cardClicked(side, "human");
    }
  }

  getProgress () {
    return Math.round(((100 * (this.props.nodes.length - this.engine.getListNodes().length - 1)) / (this.props.nodes.length)))
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
                forget={this.handleAddToBlacklist} data={this.state.leftCard.value}/>
          <Card id="right_button" side="right" handleClick={this.handleCardClicked}
                forget={this.handleAddToBlacklist} data={this.state.rightCard.value}/>
          {/*<TreeDraw tree={this.state.rootNode}></TreeDraw>*/}

          <button onClick={() => this.handleUndo()} id="undo_button" className="normalize__undo-button">
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
            <div className={"progressive-bar__status"} role="progressbar" aria-valuenow={this.getProgress()}
                 aria-valuemin="0"
                 aria-valuemax="100" style={{width: this.getProgress() + '%'}}>
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
