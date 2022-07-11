import React from 'react';
import queryString from 'query-string';
import PrioritizationEnd from './PrioritizationEnd.jsx'
import ChoicesView from './view/ChoicesView.jsx'
import AccessdeniedAnimation from './AccessdeniedAnimation.jsx';

class Choices extends React.Component {
    constructor (props) {
        super(props);
        this.handleCardClicked = this.handleCardClicked.bind(this)
        this.Trello = this.props.Trello
        this.renderForbidden = this.renderForbidden.bind(this)
        this.renderLoading = this.renderLoading.bind(this)
        this.state = {
            leftCard: null,
            rightCard: null,
            ended: false,
            voters: {left: [], right: []},
            hasVoted: false,
            hasBoardPermissions: false,
            selectedSide: null,
            roomVoters: []
        }
    }

    handleCardClicked (side) {
        this.setState({
            hasVoted: true,
            selectedSide: side
        })
    }

    renderForbidden () {
        return  <div>
                    <div className="no-access-message__container">
                        <AccessdeniedAnimation />
                        <div id="forbidden-div" className="no-access-message__heading">Ooops!</div>
                <div className="no-access-message__paragraph">You have no access to this board, please contact board's administrator to gain access.</div>
                    </div>
                </div>
    }

    renderLoading () {
        return (<span>Loading...</span>);
    }

    render () {
        if (!this.state.hasBoardPermissions) {
            return this.renderForbidden()
        }
        if (this.state.leftCard == null || this.state.rightCard == null) {
            return this.renderLoading()
        }
        if (this.state.ended) {
            return (<PrioritizationEnd/>)
        }
        return (
            <ChoicesView
                roomVoters={this.state.roomVoters}
                leftCard={this.state.leftCard}
                rightCard={this.state.rightCard}
                everybodyVoted={this.state.voters.left.length + this.state.voters.right.length > 0}
                voters={this.state.voters}
                handleAddToBlacklist={null}
                handleCardClicked={this.handleCardClicked}
                progress={0}
                selectedSide={this.state.selectedSide}
                role="voter"
            />
        )
    }
}

export default Choices
