import React from 'react'
import Card from "../components/Card.jsx"

class CardsWithVoters extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let leftCardData = {
      id: 1,
      shortUrl: "#",
      name: "Left card with some text",
      labels: [
        {
          color: "red",
          name: "Label",
          id: 1
        },
        {
          color: "green",
          name: "Label",
          id: 2
        }
      ]
    }

    let rightCardData = {
      id: 2,
      shortUrl: "#",
      name: "Right card with some text",
      labels: [
        {
          color: "green",
          name: "Label",
          id: 3
        },
        {
          color: "yellow",
          name: "Label",
          id: 4
        }
      ]
    }

    return (
      <div id="container_div">
        <div id="second_div">
          <div className="container__choose-card">
            <Card id="left_button" side="node" handleClick={() => {
            }}
                  forget={() => {
                  }} data={leftCardData}
                  voters={this.props.voters}
                  continueButton={this.props.continueButton}/>
            <Card id="right_button" side="compareNode" handleClick={() => {
            }}
                  forget={() => {
                  }} data={rightCardData}
                  voters={this.props.voters}
                  continueButton={this.props.continueButton}/>
          </div>
        </div>
      </div>
    )
  }

}

export default CardsWithVoters