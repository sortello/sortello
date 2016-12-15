import React from "react"

const ColumnSelection = React.createClass({
  render: function() {
    return (
        <div id="card_url_div">
          <div className={"centered_content"}>
            <p>Paste the url of one card from the column you need to prioritize and press The button</p>
            <p>
              <input type="text" id="card_url"/>
            </p>
            <p>
              <button className={"btn btn-large"} id="retrieve_cards">The button
              </button>
            </p>
          </div>
        </div>
    )
  }
})

export default ColumnSelection
