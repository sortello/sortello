import React from "react"

export default ({labels, onClick}) => {
  return (
		<div className="selection-form">
      <div className="board-selection__microcopy">First of all choose the board you want to prioritize</div>


      <div className={"label__container"}>
  			<div className={"label__item label__none"} onClick={(event) => onClick(0)}>
            Prioritize all labels
  			</div>
        {labels.map((item, index) => (
    	  <div className={"label__item label__"+item.color} key={index} value="{item.id}" onClick={(event) => onClick(item.id)}>
            {item.name}
			  </div>
        ))}
      </div>

		</div>
  );
};
