import React from "react"

const ApiKey = React.createClass({
  getInitialState: function(){
    return {
      apiKey: this.props.apiKey,
      Trello: this.props.Trello,
      setApiKey : this.props.setApiKey
    };
  },
  componentDidMount: function () {
    if (localStorage.getItem("sortelloTrelloDevApiKey")) {
      this.state.apiKey = localStorage.getItem("sortelloTrelloDevApiKey")
      this.authenticateTrello();
    }
  },
  saveAPIKey : function(){
    this.state.apiKey = document.getElementById("api_key").value
    localStorage.setItem('sortelloTrelloDevApiKey', this.state.apiKey);
    this.authenticateTrello();
  },
  handleButtonClick: function(){
    this.saveAPIKey()
  },
  authenticateTrello : function(){
    var that = this;
    this.state.Trello.setKey(this.state.apiKey);
    this.state.Trello.authorize({
      type: 'popup',
      name: 'Getting Started Application',
      scope: {
        read: 'true',
        write: 'true'
      },
      expiration: 'never',
      success: that.authenticationSuccess,
      error: that.authenticationFailure
    });
  },
  authenticationSuccess : function () {
    console.log("Successful authentication");
    this.props.setApiKey(this.state.apiKey);
  },
  authenticationFailure : function(){
    console.log("Failed authentication");
  },
  render: function () {
    return (
        <div id="api_key_div">
          <div className={"centered_content"}>
            <p>Please insert your api key in the field below. You can find it here:
              <a href="https://trello.com/app-key" target="_blank">https://trello.com/app-key</a></p>
            <p>
              <input type="text" id="api_key" value={this.state.apiKey}/>
            </p>
            <p>
              <button className={"btn btn-large"} id="check_api_key" onClick={this.handleButtonClick}>Continue
              </button>
            </p>
          </div>
        </div>
    )
  }
})

export default ApiKey
