import React from "react"

const Choices = React.createClass({
  render: function() {
    return (
        <div id="second_div" className={"centered_content"}>
          <div className={"row"}>
            <h2>Select the highest priority card</h2>
          </div>
          <div className={"centered_content row"}>
            <div className={"col-md-6"}>
              <div className={"jumbotron choice_button"} id="left_button" data-cardId="0">
                <h1></h1>
                <p className={"card_content"}></p>
                <p className={"card_link"}>
                  <a className={"btn btn-primary btn-lg card_link"} href="#" target="_blank"
                     role="button">See card</a>
                </p>
              </div>
            </div>
            <div className={"col-md-6"}>
              <div className={"jumbotron choice_button"} id="right_button" data-cardId="0">
                <h1></h1>
                <p className={"card_content"}></p>
                <p className={"card_link"}>
                  <a className={"btn btn-primary btn-lg card_link"} href="#" target="_blank" role="button">See card</a>
                </p>
              </div>
            </div>
          </div>
        </div>
    )
  }
})

export default Choices
