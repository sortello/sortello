import React from 'react';

export default ({forget,cardId}) => (
    <div className="card-button__esclude button-blacklist button-text__esclude"
         onClick={() => {
             forget(cardId)
         }} data-cardid={cardId}>
        Send to bottom
    </div>
)
