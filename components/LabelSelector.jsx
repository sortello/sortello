import React from "react"
import Recap from "./Recap.jsx";
import {colorNameToHex} from "../model/colorsMethod";

class LabelSelector extends React.Component {
    constructor(props){
        super(props);
        this.setLabelColor = this.setLabelColor.bind(this);
        this.state={
            labelsReady:false,
            selectedLabelColorText:"#4A4A4A",
            selectedLabelColor: "#F3F3F3"
        }
    }

    openOverlay() {
        document.getElementById('recap-overlay').style.height = "100%";
        !this.state.labelsReady?this.changeLabels() : null;
    }

    changeLabels(){
        let labels = this.props.labels;
        labels.map((item,index) => {
            labels[index].color = this.props.BoardApi.getName()==="Trello"? colorNameToHex(item.color) : "#"+item.color;
        });

        this.setState({
            labelsReady:true
        });

        return labels;
    }

    setLabelColor(color,colorText){
        if(color!==undefined || colorText !== undefined){
            this.setState({
                selectedLabelColor:color,
                selectedLabelColorText:colorText
            })
        }
    }

    normalizeButtons(labels){
        let normalizedLabels = [];
        labels.map((item,index)=>{
            normalizedLabels[index] = {
                value: {
                    color: labels[index].color,
                    id: labels[index].id,
                    idBoard: labels[index].idBoard,
                    name: labels[index].name,
                }
            }
        });
        return normalizedLabels;
    }

    closeOverlay() {
        document.getElementById('recap-overlay').style.height = "0%";
    }


    render() {
        return (
            <div>
                <div className="selection-form">
                    <div className="board-selection__microcopy">Select a label</div>
                    <div className="overlay-trigger__button button__primary button__text"
                         style={{"backgroundColor": this.state.selectedLabelColor}}
                         onClick={() => {
                             this.openOverlay()
                         }}
                    >
                        <a href="#" className="trigger-button__link"
                           style={{"color": this.state.selectedLabelColorText}}>
                            {this.props.selectedLabel!==null? this.props.selectedLabel.name : "Select Labels" }</a>
                    </div>
                </div>
                <div className="recap__overlay" id="recap-overlay" onClick={() => {
                    this.closeOverlay();
                }}>
                    <div className="recap-overlay__container">
                        <div className="recap-overlay__title">Choose one Label</div>
                        {this.state.labelsReady? <Recap buttons={this.normalizeButtons(this.props.labels)}
                                                        labelColor={this.state.selectedLabelColor}
                                                        setLabelColor = {this.setLabelColor}
                                                        setSelectedLabel={this.props.setSelectedLabel}
                                                        currentView = {this.props.currentView}/> : null}
                    </div>
                </div>
            </div>
        )
    }
}

export default LabelSelector
