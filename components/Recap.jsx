import React from "react"

class Recap extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick(item){
        if(item==="0"){
            this.props.setLabelColor("#F3F3F3","#4A4A4A");
            this.props.setSelectedLabel({
                id:0,
                name:"Select All"
            })
        }else{
            this.props.setLabelColor(item.color,"white");
            this.props.setSelectedLabel(item)
        }
    }

    render () {
        return (
            <div className="order-recap recap__container">
                {
                    this.props.currentView===2?
                        <div className="recap__item" style={{"backgroundColor":"white", "border":"1px solid black", "color":"black"}}
                            onClick={() => this.props.currentView===2? this.handleClick("0"): null}>
                            <div style={{"textAlign":"center"}}>
                                Select All
                            </div>
                        </div> : null
                }
                {this.props.buttons.map((item, index) => (
                        <div className="recap__item" key={index} style={{"backgroundColor":item.value.color}}
                             onClick={() => this.props.currentView===2? this.handleClick(item.value): null}>
                            <div style={{"color":this.props.currentView===2? "white":"black","textAlign":"center"}}>
                                {item.value.name}
                            </div>
                        </div>
                ))}
        </div>
        );
    }
};

export default Recap