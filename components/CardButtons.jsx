import React from 'react';
import SeeCardButton from './SeeCardButton.jsx'
import SendToBottomButton from './SendToBottomButton.jsx'

class CardButtons extends React.Component {
    render () {

        return (
            <div className="wrapper__card-buttons">
                <SeeCardButton shortUrl={this.props.data.shortUrl}/>
                <SendToBottomButton cardId={this.props.data.id} forget={this.props.forget}/>
            </div>
        )
    }
}

export default CardButtons
