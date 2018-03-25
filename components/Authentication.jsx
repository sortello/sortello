import React from "react"
import Logo from "./Logo.jsx"

let LOCAL_STORAGE_KEY = "sortelloTrelloDevApiKey";

class Authentication extends React.Component{
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount () {
    localStorage.setItem(LOCAL_STORAGE_KEY, trelloApiKey);
    this.props.BoardApi.authenticate(localStorage.getItem(LOCAL_STORAGE_KEY),this.props.onAuthentication);
  }

  render () {
    return (
        <div id="api_key_div">
          <div className="wrapper__api-key">
            <div className="centered-logo">
              <Logo/>
              <div className="api-key__claim">Prioritize your Trello's board in just a few steps</div>
              <button className="continue-to-choices--button button__primary button__text" onClick={() => this.handleStartButtonClick()}>Authorize Sortello and
                let's start!
              </button>
            <a href="/landing.html"><div className="button__suggestion">Want to learn more about sortello?</div></a>
            </div>
          </div>
        </div>
    )
  }
}

export default Authentication
