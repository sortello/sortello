import React from 'react';

export default ({url, BoardApi}) => (
    <a href={url} target="_blank"
       className={"button__primary button__text check-sortello__button"}>
        <i className={BoardApi.getIcon()}/>&nbsp;
        {"Check your " + BoardApi.getName() + " board"}
    </a>
)