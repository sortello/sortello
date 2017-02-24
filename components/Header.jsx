import React from "react"

const Header = React.createClass({
    handleLogout: function() {
        localStorage.removeItem('sortelloTrelloDevApiKey');
        location.reload();
    },
    render: function() {
        return (
            <p>
                <button className="" onClick={this.handleLogout}>Logout</button>
            </p>
        );
    }

});

export default Header
