import React from 'react';
import CardButtons from './CardButtons.jsx'

class Card extends React.Component {
  render () {
    let cardButtons = '';
    if (this.props.forget !== null) {
      cardButtons =
        <CardButtons continueButton={this.props.continueButton} data={this.props.data} forget={this.props.forget}/>
    }

    return (
      <div className={"wrapper__card choices--button"} id={this.props.id}>
        <div className={"container__card"} onClick={() => {
          this.props.handleClick(this.props.side)
        }} data-cardId="0">
          <div className={'container__label'}>
            {this.props.data.labels.map(label => (
              <div
                className={`card__label card__label--${label.color}`}
                key={label.id}
              >
                {label.name}
              </div>
            ))}
          </div>
          <div className={'label__separator'}>
          </div>
          <div className="card__title">{this.props.data.name}</div>
          <div className={'card__voters'}>
            {this.props.voters.map((item, index) => (
              <img className={'card__voter'} key={index} src={item.trelloAvatar}/>
            ))}
          </div>
        </div>
        {cardButtons}
      </div>
    );
  }
}

export default Card;
