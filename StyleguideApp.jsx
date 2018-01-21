import React from "react"
import PrioritizationEnd from "./components/PrioritizationEnd.jsx"
import ChoicesView from "./components/view/ChoicesView.jsx"
import ChoicesVoter from "./components/ChoicesVoter.jsx"

class StyleguideApp extends React.Component {
    constructor (props) {
        super(props)
    }

    render () {
        let leftCardData = {
            value: {
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
        }

        let rightCardData = {
            value: {
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
        }

        let roomVoters = [
            {trelloAvatar: '//www.gravatar.com/avatar/94d093eda664addd6e450d7ew881bcad?s=32&d=identicon&r=PG'},
            {trelloAvatar: '//www.gravatar.com/avatar/94d093eda664addd6e450d7ew831bcad?s=32&d=identicon&r=PG'}

        ]

        let voters = {
            left:
                [
                    {trelloAvatar: '//www.gravatar.com/avatar/94d093eda664addd6e450d7ew881bcad?s=32&d=identicon&r=PG'},
                    {trelloAvatar: '//www.gravatar.com/avatar/94d093eda664addd6e450d7ew831bcad?s=32&d=identicon&r=PG'}

                ],
            right:
                [
                    {trelloAvatar: '//www.gravatar.com/avatar/94d093eda664addd6e450d7ew831bcad?s=32&d=identicon&r=PG'}
                ]
        }

        return (
            <div id="container_div">
                <h1>Choices view for voter</h1>
                <ChoicesView
                    newRoomButton={""}
                    roomLink={""}
                    roomVoters={roomVoters}
                    leftCard={leftCardData}
                    rightCard={rightCardData}
                    everybodyVoted={true}
                    voters={voters}
                    handleAddToBlacklist={this.handleAddToBlacklist}
                    handleCardClicked={() => {
                    }}
                    handleUndoClicked={() => {
                    }}
                    handleGoToNextVoting={() => {
                    }}
                    progress={60}
                />
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
