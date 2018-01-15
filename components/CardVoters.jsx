import React from 'react';

class CardVoters extends React.Component {
  render () {
    return (
      <div className={'card__voters'}>
        {this.props.voters.map((item, index) => (
          <img className={'card__voter'} key={index} src={item.trelloAvatar}/>
        ))}
      </div>
    )
  }
}

export default CardVoters
