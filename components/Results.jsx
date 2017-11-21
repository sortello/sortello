import React from "react"
import Header from './Header.jsx';
import traverseTree from "../model/traverseTree"
import AlmostDoneAnimation from './AlmostDoneAnimation.jsx';
import Recap from './Recap.jsx';
import SuccessAnimation from './SuccessAnimation.jsx';
import Footer from "./Footer.jsx"

function openOverlay () {
  document.getElementById('recap-overlay').style.height = "100%";
}

function closeOverlay () {
  document.getElementById('recap-overlay').style.height = "0%";
}


class Results extends React.Component {
  constructor (props) {
    super(props);
    this.state = {uploadDone: false, duration: null};
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount () {
    this.setDuration();
  }

  setDuration () {
    var component = this;
    let start = this.props.startTimeStamp;
    let end = Date.now();
    component.setState({
      duration: end - start
    })
  }

  getReorderedNodes () {
    return traverseTree(this.props.rootNode)
  }

  updateBoard () {
    var component = this;

    function showUploadDone () {
      component.setState({
        uploadDone: true
      })
    }

    let reorderedNodes = this.getReorderedNodes().reverse();
    let putCalls = reorderedNodes.length;
    if (gaTrackingId && this.state.duration !== null) {
      console.log('Finished in ' + this.state.duration + ' ms with ' + putCalls + ' cards');
      ga('send', {
        hitType: 'event',
        eventCategory: 'Time stats',
        eventAction: putCalls,
        eventLabel: this.state.duration
      });
    }
    var Trello = this.props.Trello;

    let nextCardIndex = 0;

    function placeNextCard () {
      if (nextCardIndex >= reorderedNodes.length) {
        showUploadDone();
        return;
      }
      Trello.put('/cards/' + reorderedNodes[nextCardIndex].value.id, {pos: 'top'}, placeNextCard, restart);
      nextCardIndex++;
    }

    function restart () {
      nextCardIndex = 0;
      placeNextCard({pos: null});
    }

    placeNextCard({pos: null});
  }

  render () {
    return (
      <div className={"send-ordered__wrapper"}>
        <div id="last_div" className={"send-ordered__container"}>
          <div className={""}>
            {this.state.uploadDone ?
              <div className="send-success__container">
                <SuccessAnimation/>
                <div className="send-success__heading">Prioritization complete!</div>
                <div className="success-buttons__container">
                  <a href={"https://trello.com/b/" + this.props.rootNode.value.idBoard} target="_blank"
                     className={"button__primary button__text check-trello__button"}>
                    <i className="fa fa-trello"></i>&nbsp;
                    Check your Trello board
                  </a>
                  <a href="/" className={"button__primary button__text prioritize-again__button"}>
                    <i className="fa fa-repeat"></i>&nbsp;
                    Prioritize another list
                  </a>
                </div>
              </div>
              :
              <div>
                <AlmostDoneAnimation/>
                <div className="send-ordered__heading">Almost done!</div>
                <div className="send-ordered__button button__primary button__text" onClick={() => this.updateBoard()}>
                  <button id="update_board" >
                    Send ordered data to your board
                  </button>
                </div>

                <div className="overlay-trigger__button button__primary button__text" onClick={() => {
                  openOverlay()
                }}>
                  <a href="#" className="trigger-button__link">Take a look at your new list</a>
                </div>
                <div className="recap__overlay" id="recap-overlay" onClick={() => {
                  closeOverlay()
                }}>
                  <div className="recap-overlay__container">
                    <div className="recap-overlay__title">Check it out! This is your new list</div>
                    <Recap cards={this.getReorderedNodes()}/>
                    <div className="button__primary button__text recap-overlay__button" onClick={(e) => this.updateBoard(e)}>
                      <button id="recap_update_board">
                        Send ordered data to your board
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            }
          </div>
        </div>
        <div className={"footer footer__fade"}>
          <Footer/>
          <Header/>
        </div>
      </div>
    )
  }
};

export default Results
