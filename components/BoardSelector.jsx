import React from 'react'
import Select from './Select.jsx'

export default ({onChange, groupedboards}) => (
    <div className="selection-form">
        <div className="board-selection__microcopy">First of all choose the board you want to prioritize</div>
        <Select
            onChange={onChange}
            placeHolder={"Select a board"}
            options={
                Object.keys(groupedboards).map(function (key) {
                    let group = groupedboards[key];
                    return <optgroup key={key} label={key}>
                        {(
                            group.map(function (board) {
                                return <option key={board.id} value={board.id}>{board.name}</option>
                            }.bind(this))
                        )} </optgroup>
                }.bind(this))
            }
        />
    </div>
)
