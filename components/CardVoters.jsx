import React from 'react';
import Avatars from './Avatars.jsx'

class CardVoters extends React.Component {
    render() {
        return (
            <div className={'card__voters'}>
                <Avatars users={this.props.voters}/>
            </div>
        )
    }
}

export default CardVoters
