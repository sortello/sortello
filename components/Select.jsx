import React from 'react'

export default ({id,options, onChange, placeHolder}) => {
    return <div className="input-select">
            <select id={id} onChange={(event) => onChange(event.target)} className={"select-field__select input-select__field"}>
                <option selected disabled>{placeHolder}</option>
                {options}
            </select>
            <i className="material-icons input-select__icon">arrow_drop_down</i>
          </div>
};
