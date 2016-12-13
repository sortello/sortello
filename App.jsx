import React from "react" // ES6 import

const App = React.createClass({
    render: function() {
        return (
            <div id="container_div">
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
                <div id="last_div" className={"centered_content"}>
                    <div className={"centered_content"}>
                        <span className={"almost"}>Almost</span> <span className={"done"}> done:</span>
                        <br/>
                            <button className={"btn btn-large btn-success"} id="update_board">Send ordered data to board</button>
                            <span className={"checkboard"}> Check your Trello board :)</span>
                    </div>
                </div>
            </div>
        )
    },
})

export default App // important