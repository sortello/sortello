import React from "react"

export default ({groupedboards, onChange}) => {
  return <select onChange={(event) => onChange(event.target.value)} className={"select-field__select align-center"}>

    {
      Object.keys(groupedboards).map(function (key) {
        var group = groupedboards[key];
        return <optgroup key={key} label={key}>
          <option>Select a board</option>
          {(
              group.map(function (board) {
                return <option key={board.id} value={board.id}>{board.name}</option>
              }.bind(this))
          )} </optgroup>
      }.bind(this))
    }
  </select>
};
