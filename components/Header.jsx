import React from "react"

const Header = React.createClass({
    handleLogout: function() {
        localStorage.removeItem('sortelloTrelloDevApiKey');
        localStorage.removeItem('trello_token');
        location.reload();
    },
    render: function() {
        return (
            <div>
                <button className="logout__button--style" onClick={this.handleLogout}>Logout</button>
            </div>
        );
    }

});

export default Header
