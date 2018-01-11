import React from "react"
import Results from "./components/Results.jsx"


class StyleguideApp extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div id="container_div">
        <Results rootNode={this.state.rootNode} Trello={{}}/>
      </div>
    )
  }
}

export default StyleguideApp
