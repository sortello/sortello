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
    this.handleCardClicked = this.handleCardClicked.bind(this)
    this.handleAddToBlacklist = this.handleAddToBlacklist.bind(this)
    this.handleUndoClicked = this.handleUndoClicked.bind(this)
    this.startChoices = this.startChoices.bind(this)

    this.state = {
      leftCard: null,
      rightCard: null
    }
  }

  startChoices () {
    this.props.setStartTimeStamp(Date.now())
    this.engine.nextStepOrEnd();
    this.getNextChoice()
  }

  getNextChoice () {
    if (this.engine.getEnded()) {
      this.props.setSortedRootNode(this.engine.getRootNode());
      return
    }
    this.setState({
      leftCard: this.engine.getNode(),
      rightCard: this.engine.getCompareNode()
    }, function () {
      if (this.engine.autoChoice()) {
        this.getNextChoice()
      }
    });
  }

  handleUndoClicked () {
    this.engine.undo();
    this.getNextChoice()
  }

  handleAddToBlacklist (nodeId) {
    this.engine.addToBlackList(nodeId);
    this.getNextChoice();
  }

  handleCardClicked (side) {
    this.engine.choiceMade(side, "human");
    this.getNextChoice()
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
          <div className="container__top-bar">
            <div className="choose-card__heading">Select the highest priority card</div>
            <div className="container__prioritization-status">
              <div className={"progressive-bar__status-structure"}>
                <div className={"progressive-bar__status"} role="progressbar" aria-valuenow={this.state.progress}
                     aria-valuemin="0"
                     aria-valuemax="100" style={{width: this.getProgress() + '%'}}>
                </div>
              </div>
            </div>
          </div>
          <Card id="left_button" side="node" handleClick={this.handleCardClicked}
                forget={this.handleAddToBlacklist} data={this.state.leftCard.value}/>
          <Card id="right_button" side="compareNode" handleClick={this.handleCardClicked}
                forget={this.handleAddToBlacklist} data={this.state.rightCard.value}/>
          {/*<TreeDraw tree={this.state.rootNode}></TreeDraw>*/}

          <button onClick={() => this.handleUndoClicked()} id="undo_button" className="normalize__undo-button">
            <div className="undo__button">
              <div className="undo__icon">
                <img src="assets/icons/undo-icon.svg" alt=""/>
                Undo choice
              </div>
            </div>
          </button>

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
