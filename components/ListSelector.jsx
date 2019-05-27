import React from 'react'
import Select from './Select.jsx'

export default ({onChange, lists}) => (
    <div className="selection-form">
        <div className="board-selection__microcopy">Select the correct column</div>
        <Select
            onChange={onChange}
            placeHolder={"Select a List"}
            options={
                lists.map(function (list) {
                    return <option key={list.id} value={list.id}>{list.name}</option>
                }.bind(this))
            }
        />
    </div>
)
