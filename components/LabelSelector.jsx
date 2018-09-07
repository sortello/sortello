import React from "react"
import Select from './Select.jsx'


export default ({labels, onChange}) => {
  return (
		<div className="selection-form">
      <div className="board-selection__microcopy">First of all choose the board you want to prioritize</div>

      <Select
          onChange={onChange}
          placeHolder={"Select a label"}
          options={
              labels.map(function (item) {
                  return <option key={item.id} value={item.id}>{item.name}</option>
              }.bind(this))
          }
      />


      {/* <div className={"label__container"}>
  			<div className={"label__item label__none"} onClick={(event) => onClick(0)}>
            Prioritize all labels
  			</div>
        {labels.map((item, index) => (
    	  <div className={"label__item label__"+item.color} key={index} value="{item.id}" onClick={(event) => onClick(item.id)}>
            {item.name}
			  </div>
        ))}
      </div> */}




		</div>
  );
};
