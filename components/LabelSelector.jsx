import React from "react"

export default ({labels, onClick}) => {
  return (
		<div>
			<div
				className={"label label__none"}
				onClick={(event) => onClick(0)}>
        All cards
			</div>
      {labels.map((item, index) => (
      	<div
								className={"label label__"+item.color}
								key={index} value="{item.id}"
								onClick={(event) => onClick(item.id)}>
          {item.name}
				</div>
      ))}
		</div>
  );
};
