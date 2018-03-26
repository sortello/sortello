import React from "react"
import Logo from "./Logo.jsx"

class Authentication extends React.Component {
    constructor (props) {
        super(props);
    }

    handleStartButtonClick () {
        this.props.BoardApi.authenticate(this.props.onAuthentication);
    }

    render () {
        return (
            <div id="api_key_div">
                <div className="wrapper__api-key">
                    <div className="centered-logo">
                        <Logo/>
                        <div className="api-key__claim">Prioritize your {this.props.fromExtension!==null? this.props.fromExtension+"'s " : ""}
                             board in just a few steps</div>
                        <button className="continue-to-choices--button button__primary button__text"
                                onClick={() => this.handleStartButtonClick()}>Authorize {this.props.fromExtension} and
                            let's start!
                        </button>
                        <a href="/landing.html">
                            <div className="button__suggestion">Want to learn more about sortello?</div>
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default Authentication
