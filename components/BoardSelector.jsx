import React from "react"

export default ({groupedboards, onChange}) => {
  return <select onChange={(event) => onChange(event.target.value)} className={"btn btn-large btn-select"}>

    {
      Object.keys(groupedboards).map(function (key) {
        var group = groupedboards[key];
        return <optgroup key={key} label={key}>
          {(
              group.map(function (board) {
                return <option key={board.id} value={board.id}>{board.name}</option>
              }.bind(this))
          )} </optgroup>
      }.bind(this))
    }
  </select>
};