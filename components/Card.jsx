import React from 'react';
import CardButtons from './CardButtons.jsx'
import CardVoters from './CardVoters.jsx';
import CardLabels from './CardLabels.jsx';

class Card extends React.Component {
    render () {
        let cardButtons =
            <CardButtons side={this.props.side} data={this.props.data} forget={this.props.forget}/>
        return (
            <div className={"wrapper__card choices--button"} id={this.props.id}>
                <div className={"container__card " + (this.props.selected ? "container__card-selected" : "")}
                     onClick={() => {
                         this.props.handleClick(this.props.side)
                     }
                     } data-cardId="0">
                    <CardLabels labels={this.props.data.labels}/>
                    <div className={'label__separator'}></div>
                    <div className="card__title">{this.props.data.name}</div>
                </div>
                {this.props.forget !== null ? cardButtons : null}
            </div>
        );
    }
}

export default Card;
