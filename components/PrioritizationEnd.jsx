import React from "react"
import SuccessAnimation from './SuccessAnimation.jsx';
import CheckBoardButton from './CheckBoardButton.jsx';
import PrioritizeAnotherListButton from './PrioritizeAnotherListButton.jsx';

export default ({url, BoardApi}) => (
    <div className="prioritization-end__container">
        <SuccessAnimation/>
        <div className="prioritization-end__heading">Prioritization it's over!</div>
        <div className="prioritization-end__paragraph">Go to your board to see your tasks ordered,
            or open a new room and restart prioritizing.
        </div>
        <div className="prioritization-end__buttons">
            <CheckBoardButton url={url} BoardApi={BoardApi}/>
            {BoardApi.getName() === "Trello" && <PrioritizeAnotherListButton/>}
        </div>
    </div>
)