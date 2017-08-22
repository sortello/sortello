import React from "react"

const Recap = React.createClass({
    render: function() {
        return (
			<div className="order-recap recap__container">
        {this.props.cards.map((item, index) => (
					<div className="recap__item" key={index}>{item.value.name}</div>
        ))}
			</div>
        );
    }

});

export default Recap