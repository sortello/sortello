import React from "react"

const Header = React.createClass({
    handleLogout: function() {
        localStorage.removeItem('sortelloTrelloDevApiKey');
        location.reload();
    },
    render: function() {
        return (
            <h1 style={{marginTop: "0"}}>
                Sortello
                <button className="btn btn-small pull-left" onClick={this.handleLogout}>Logout</button>
            </h1>
        );
    }

});

export default Header