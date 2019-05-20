import React from "react"

class Recap extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick(item){
        if(item==="0"){
            this.props.setLabelColor("#F3F3F3");
            this.props.setSelectedLabel({
                id:0,
                name:"Select All"
            }, () =>{})
        }else{
            this.props.setLabelColor(item.color);
            this.props.setSelectedLabel(item, () =>{})
        }
    }

    render () {
        return (
            <div className="order-recap recap__container">
                {
                    this.props.currentView===2?
                        <div className="recap__item" onClick={() => this.props.currentView===2? this.handleClick("0"): null}>
                            <div className="recap__content">
                                <p className="recap__text"> Select All </p>
                                <p className="recap__color"/>
                            </div>
                        </div>
                    : null
                }
                {this.props.buttons.map((item, index) => (
                        <div className="recap__item" key={index} onClick={() => this.props.currentView===2? this.handleClick(item.value): null}>
                            <div className="recap__content">
                                <p className="recap__text"> {item.value.name} </p>
                                {this.props.currentView===2?
                                    <div className="recap__color" style={{"backgroundColor": item.value.color}}/>
                                    : null}
                            </div>
                        </div>
                ))}
        </div>
        );
    }
};

export default Recap