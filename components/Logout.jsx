import React from "react"

const handleLogout = () => {
    localStorage.removeItem('sortelloTrelloDevApiKey');
    localStorage.removeItem('trello_token');
    localStorage.removeItem('token');
    location.reload();
};

export default () => (
    <div>
        <div className="logout__button">
            <button className="logout__button--style" onClick={handleLogout}>Logout</button>
        </div>
    </div>
)
