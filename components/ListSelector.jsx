import React from "react"

export default ({lists, onChange}) => {
    return <select onChange={(event) => onChange(event.target.value)} className={"btn btn-large btn-select"}>
        <option>Select a List</option>
        {

            lists.map(function (list) {
                return <option key={list.id} className={"btn btn-large"} value={list.id}>{list.name}</option>
            }.bind(this))
        }
    </select>
};
