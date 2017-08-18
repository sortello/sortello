import React from "react"

const Card = React.createClass({
    render: function() {
        return (
            <div className={"wrapper__card choices--button"} id={this.props.id}>
              <div className="container__card"  data-cardId="0">
                <div className="card__title">{this.props.data.name}</div>
              </div>
              <div className="wrapper__card-buttons">
                <a href={this.props.data.shortUrl} target="_blank" role="button" className="button-seecard card-button__see-card">
                     <div className="button-text__see-card">See card</div>
                </a>
                <div className="card-button__esclude">
                    <a className="button-blacklist button-text__esclude" target="_blank"
                        role="button">Forget this card</a>
                </div>
              </div> 
            </div>
        );
    }

});

export default Card
