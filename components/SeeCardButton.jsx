import React from 'react';

export default ({shortUrl}) => (
    shortUrl !== "" &&
    <a href={shortUrl}
       target="_blank"
       role="button"
       className="button-seecard card-button__see-card">
        <div className="button-text__see-card">See card</div>
    </a>
)