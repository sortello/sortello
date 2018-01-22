import React from "react"
import PrioritizationEnd from "./components/PrioritizationEnd.jsx"
import ChoicesView from "./components/view/ChoicesView.jsx"
import ChoicesVoter from "./components/ChoicesVoter.jsx"
import loremIpsum from 'lorem-ipsum'

const randomColor = () => {
    return ['red', 'green', 'blue', 'yellow'][randInt(0, 3)]
}

const randInt = (min, max) => {
    return (Math.floor(Math.random() * ((max + 1) - min)) + min)
}

const createCardData = () => {
    return {
        value: {
            id: randInt(0, 1000),
            shortUrl: "#",
            name: loremIpsum({count: 1, units: 'sentences'}),
            labels: [
                {
                    color: randomColor(),
                    name: loremIpsum({count: 1, units: 'words'}),
                    id: randInt(0, 1000)
                },
                {
                    color: randomColor(),
                    name: loremIpsum({count: 1, units: 'words'}),
                    id: randInt(0, 1000)
                }
            ]
        }
    }
}

const voters = {
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

const roomVoters = [
    {trelloAvatar: '//www.gravatar.com/avatar/94d093eda664addd6e450d7ew881bcad?s=32&d=identicon&r=PG'},
    {trelloAvatar: '//www.gravatar.com/avatar/94d093eda664addd6e450d7ew831bcad?s=32&d=identicon&r=PG'}
]

class StyleguideApp extends React.Component {
    constructor (props) {
        super(props)
    }

    renderChoicesView () {
        return (
            <ChoicesView
                newRoomButton={""}
                roomLink={""}
                roomVoters={roomVoters}
                leftCard={createCardData()}
                rightCard={createCardData()}
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
        )
    }

    render () {
        return (
            <div id="container_div">
                <h1>Choices view for voter</h1>
                {this.renderChoicesView()}
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
