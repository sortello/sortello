import React from "react"

const Card = React.createClass({
    render: function() {
        return (
            <div className={"wrapper__card"} id={this.props.id}>
              <div className="container__card"  data-cardId="0">
                <div className="card__title">{this.props.data.name}</div>
              </div>
              <div className="wrapper__card-buttons">
                <a href={this.props.data.shortUrl} target="_blank" role="button">
                     <div className="card-button__see-card">See card</div>
                </a>
              </div> 
            </div>
        );
    }

});

export default Card
