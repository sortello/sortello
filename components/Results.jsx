import React from "react"

const Results = React.createClass({
  render: function() {
    return (
        <div id="last_div" className={"centered_content"}>
          <div className={"centered_content"}>
            <span className={"almost"}>Almost</span> <span className={"done"}> done:</span>
            <br/>
            <button className={"btn btn-large btn-success"} id="update_board">Send ordered data to board</button>
            <span className={"checkboard"}> Check your Trello board :)</span>
          </div>
        </div>
    )
  }
})

export default Results
