import React from 'react'
import Select from './Select.jsx'


class ListSelector extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return <Select
            onChange={this.props.onChange}
            placeHolder={"Select a List"}
            options={
                this.props.lists.map(function (list) {
                    return <option key={list.id} value={list.id}>{list.name}</option>
                }.bind(this))
            }
        />

    }
}

export default ListSelector

