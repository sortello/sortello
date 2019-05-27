import React from 'react'

export default ({className,users}) => (
    <div className={className ? className : ''}>
        {users.map((item, index) => (
            <img className={item.isAdmin ? "card__admin" : "card__voter"} key={index}
                 src={item.avatar || item.sortelloAvatar} alt={"avatar"}/>
            ))}
    </div>
)