import React from "react"
import Select from './Select.jsx'


export default ({labels, onChange}) => {
    return (
        <div className="selection-form">
            <div className="board-selection__microcopy">Select a label</div>

            <Select
                onChange={onChange}
                placeHolder={"Prioritize all labels"}
                options={
                    labels.map(function (item) {
                        return <option key={item.id} value={item.id}>{item.name}</option>
                    }.bind(this))
                }
            />
        </div>
    );
};
