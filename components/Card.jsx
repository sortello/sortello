import React from "react"

const Card = React.createClass({
    render: function() {
        return (
            <div className={"col-md-6"}>
              <div className={"choices--button"} id={this.props.id} data-cardId="0">
                <h1></h1>
                <p className={"card_link"}>
                  <a className={"button--on-white btn-primary btn-lg"} href="#" target="_blank"
                     role="button">See card</a>
                </p>
              </div>
            </div>
        );
    }

});

export default Card
