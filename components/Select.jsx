import React from 'react'

export default ({options, onChange, placeHolder}) => {
    return <select onChange={(event) => onChange(event.target.value)} className={"select-field__select"}>
        <option>{placeHolder}</option>
        {options}
    </select>
};
