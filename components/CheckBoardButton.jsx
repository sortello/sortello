import React from 'react';

class CheckBoardButton extends React.Component {
    render () {
        return (
            <a href={this.props.url} target="_blank"
               className={"button__primary button__text check-sortello__button"}>
                <i className="fa fa-trello"></i>&nbsp;
                {this.props.text}
            </a>
        )
    }
}

export default CheckBoardButton
