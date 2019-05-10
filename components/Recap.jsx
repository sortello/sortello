import React from "react"
/*import {hexToRgb} from "../model/colorsMethod";*/


class Recap extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props.buttons);
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
                <div className="recap__item" style={{"backgroundColor":"white", "border":"1px solid black", "color":"black"}}
                     onClick={() => this.handleClick("0")}>
                    <div style={{"textAlign":"center"}}>
                       Select All
                    </div>
                </div>
                {this.props.buttons.map((item, index) => (
                    <div className="recap__item" key={index} style={{"backgroundColor":item.value.color}}
                         onClick={() => this.handleClick(item.value)}>
                        <div style={{"color":"white","textAlign":"center"}}>
                            {item.value.name}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
};

export default Recap