import React from "react"

const ApiKey = React.createClass({
  render: function() {
    return (
          <div id="api_key_div">
            <div className={"centered_content"}>
              <p>Please insert your api key in the field below. You can find it here:
                <a href="https://trello.com/app-key" target="_blank">https://trello.com/app-key</a></p>
              <p>
                <input type="text" id="api_key"/>
              </p>
              <p>
                <button className={"btn btn-large"} id="check_api_key">Continue
                </button>
              </p>
            </div>
          </div>
    )
  }
})

export default ApiKey
