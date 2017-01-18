import React from "react"

export default ({groupedboards, onChange}) => {
  return <select onChange={(event) => onChange(event.target.value)}>
    {
      Object.keys(groupedboards).map(function (key) {
        var group = groupedboards[key]
        return (
            group.map(function (board) {
              return <option key={board.id} className={"btn btn-large"} value={board.id}>{board.name}</option>
            }.bind(this))
        )
      }.bind(this))
    }
  </select>
};