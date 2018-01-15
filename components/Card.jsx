import React from 'react';
import CardButtons from './CardButtons.jsx'
import CardVoters from './CardVoters.jsx';
import CardLabels from './CardLabels.jsx';

class Card extends React.Component {
  render () {
    let continueButton = null
    if (this.props.everybodyVoted) {
      continueButton = <div className="card-button__continue"
                            onClick={() => this.props.handleGoToNextVoting(this.props.side)}>Continue</div>
    }

    let cardButtons =
      <CardButtons continueButton={continueButton} data={this.props.data} forget={this.props.forget}/>

    return (
      <div className={"wrapper__card choices--button"} id={this.props.id}>
        <div className={"container__card"} onClick={() => {
          this.props.handleClick(this.props.side)
        }} data-cardId="0">
          <CardLabels labels={this.props.data.labels}/>
          <div className={'label__separator'}></div>
          <div className="card__title">{this.props.data.name}</div>
          {this.props.everybodyVoted ? <CardVoters voters={this.props.voters}/> : null}
        </div>
        {this.props.forget !== null ? cardButtons : null}
      </div>
    );
  }
}

export default Card;
