import React from 'react';

class SeeCardButton extends React.Component {
  render () {
    return (
      <a href={this.props.shortUrl}
         target="_blank"
         role="button"
         className="button-seecard card-button__see-card">
        <div className="button-text__see-card">See card</div>
      </a>
    )
  }
}

export default SeeCardButton
