import React from "react"
import PrioritizationEnd from "./components/PrioritizationEnd.jsx"
import CardsWithVoters from "./styleGuideComponents/CardsWithVoters.jsx"
import ChoicesVoter from "./components/ChoicesVoter.jsx"

class StyleguideApp extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {

    let voters = [
      {trelloAvatar: '//www.gravatar.com/avatar/94d093eda664addd6e450d7ew881bcad?s=32&d=identicon&r=PG'},
      {trelloAvatar: '//www.gravatar.com/avatar/94d093eda664addd6e450d7ew831bcad?s=32&d=identicon&r=PG'}
    ]

    let continueButton = <div className="card-button__continue"
                              onClick={() => {
                              }}>Continue</div>


    return (
      <div id="container_div">
        <CardsWithVoters voters={[]} continueButton={""}/>
        <hr/>
        <CardsWithVoters voters={voters} continueButton={continueButton}/>
        <hr/>
        <ChoicesVoter/>
        <hr/>
        <PrioritizationEnd/>
        <hr/>
        <h1>Choices view for voter</h1>
      </div>
    )
  }
}

export default StyleguideApp
