import React from "react"

class AccessdeniedAnimation extends React.Component{
    render() {
        return (
			<div>
				<svg version="1.1" id="Livello_1" x="0px" y="0px" width="100px" height="100px" viewBox="0 0 100 100">
				<circle className="denied-illo__fill" cx="50" cy="50" r="47.5" />
				<line className="denied-illo__fill" x1="30.9" y1="30.9" x2="69.1" y2="69.1" />
				<line className="denied-illo__fill" x1="69.1" y1="30.9" x2="30.9" y2="69.1" />
				</svg>
			</div>
        );
    }
}

export default AccessdeniedAnimation