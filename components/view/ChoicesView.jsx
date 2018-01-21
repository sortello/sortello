import React from "react";
import Header from '../Header.jsx';
import TreeDraw from '../TreeDraw.jsx';
import Card from '../Card.jsx';
import Footer from "../Footer.jsx"
import {clone} from "lodash"
import {find} from "lodash"
import {findIndex} from "lodash"
import {remove} from "lodash"
import Avatars from '../Avatars.jsx'

class ChoicesView extends React.Component {

    constructor (props) {
        super(props);
        this.printCard = this.printCard.bind(this)
    }

    printCard (id, side, data, voters) {
        return <Card id={id} side={side} handleClick={this.props.handleCardClicked}
                     forget={this.props.handleAddToBlacklist} data={data}
                     voters={voters}
                     everybodyVoted={this.props.everybodyVoted}
                     handleGoToNextVoting={this.props.handleGoToNextVoting}
        />
    }

    render () {
        let undoButton = ''
        if (this.props.handleUndoClicked) {
            undoButton =
                <button onClick={() => this.props.handleUndoClicked()} id="undo_button"
                        className="normalize__undo-button">
                    <div className="undo__button">
                        <div className="undo__icon">
                            <img src="assets/icons/undo-icon.svg" alt=""/>
                            Undo choice
                        </div>
                    </div>
                </button>
        }


        if (this.props.leftCard == null || this.props.rightCard == null) {
            return (<div><span>Loading...</span></div>);
        }
        return (
            <div id="second_div">
                <div className="container__choose-card">
                    <div className="container__top-bar">
                        <div className="choose-card__heading">Select the highest priority card</div>
                        <div className="container__prioritization-status">
                            <div className={"progressive-bar__status-structure"}>
                                <div className={"progressive-bar__status"} role="progressbar"
                                     aria-valuenow={this.props.progress}
                                     aria-valuemin="0"
                                     aria-valuemax="100" style={{width: this.props.progress + '%'}}>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.printCard('left_button', 'node', this.props.leftCard.value, this.props.voters.left)}
                    {this.printCard('right_button', 'compareNode', this.props.rightCard.value, this.props.voters.right)}
                    {/*<TreeDraw tree={this.state.rootNode}></TreeDraw>*/}
                    {undoButton}
                </div>
                <div className={"footer"}>
                    <Footer/>
                    <Header/>
                </div>
                {this.props.newRoomButton}
                {this.props.roomLink}
                <Avatars users={this.props.roomVoters}/>

            </div>
        )
    }
}

export default ChoicesView
