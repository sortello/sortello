import React from "react"

const Recap = React.createClass({
    render: function() {
        return (
			<div className="order-recap">
        {this.props.cards.map((item, index) => (
					<p key={index}>{item.value.name}</p>
        ))}
			</div>
        );
    }

});

export default Recap