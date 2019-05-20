import React from "react";
import LabelSelector from "./LabelSelector.jsx";
import {shallow} from 'enzyme';
import TrelloApi from "../api/TrelloApi";
import GithubApi from "../api/GithubApi";

describe("LabelSelector", () => {
    let props = {
        BoardApi : new TrelloApi(),
        labels:
            [
                {
                    color: "green",
                    id: "id",
                    idBoard: "idB",
                    name: "Label1"
                }
            ],
        selectedLabel:{
            name: "Label1"
        }

    };

    it("changes colors of labels from name to hex when using Trello", () => {
        let wrapper = shallow(<LabelSelector {...props}/>);
        let labels = wrapper.instance().changeColorLabels();
        expect(wrapper.instance().state.labelsReady).toBe(true);
        expect(labels[0].color).not.toBe("green")
        expect(labels[0].color).toBe("#008000")
    });

    it("add '#' to colors of labels when using Github", () => {
        let wrapper = shallow(<LabelSelector {...props}/>);
        wrapper.setProps({
            labels : [
                {
                    color: "008000",
                    id: "id",
                    idBoard: "idB",
                    name: "Label1"
                }],
            BoardApi : new GithubApi()
         });
        let labels = wrapper.instance().changeColorLabels();
        expect(wrapper.instance().state.labelsReady).toBe(true);
        expect(labels[0].color).not.toBe("008000")
        expect(labels[0].color).toBe("#008000")
    });

    it("sets label colors correctly if user didn't select 'Select All' ", () => {
        let wrapper = shallow(<LabelSelector {...props}/>);
        wrapper.instance().setLabelColor("#008000");
        expect(wrapper.instance().state.selectedLabelColor).toBe("#008000");
    });

    it("prepares buttons for the Recap ", () => {
        let wrapper = shallow(<LabelSelector {...props}/>);
        let normalizedButtons = wrapper.instance().normalizeButtons();
        expect(normalizedButtons[0].value.color).toBe("#008000");
        expect(normalizedButtons[0].color).toBe(undefined);
    });

});