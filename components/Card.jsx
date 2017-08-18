import React from "react"

const Card = React.createClass({
    render: function() {
        return (
            <div className={"wrapper__card choices--button"} id={this.props.id}>
              <div className="container__card"  data-cardId="0">
                <div className="card__title">{this.props.data.name}</div>
              </div>
              <div className="wrapper__card-buttons">
                <a href={this.props.data.shortUrl} target="_blank" role="button" className="button-seecard">
                     <div className="card-button__see-card">See card</div>
                </a>
                <a className="button--on-white btn-primary btn-lg button-blacklist" target="_blank"
                     role="button">I really don't care</a>
              </div> 
            </div>
        );
    }

});

export default Card
