import React from "react";
import {shallow} from 'enzyme';
import Avatars from "./Avatars";
import TrelloApi from "../Api/TrelloApi"
import Choices from "./Choices";
import Room from "../model/Room";
import Engine from "../model/Engine"

describe("Choices", () => {
    let props = {
        BoardApi: null,
        setSortedRootNode: null,
        setStartTimeStamp: null,
        nodes: [],
        rootNode: null
    }

    it("updates votes if a room is opened when card is clicked ", () => {
        props.BoardApi = new TrelloApi();
        let wrapper = shallow(<Choices {...props}/>)
        const socket = {emit: jest.fn()}
        const roomKey = "123"
        wrapper.instance().room = new Room(socket,roomKey);
        let spy = spyOn(wrapper.instance().room, 'addVoteToVoters');
        wrapper.instance().cardClicked = jest.fn();
        wrapper.instance().handleCardClicked("side");
        expect(spy).toHaveBeenCalled();

    });

    it("handles click of cards if room is opened and voters are zero or if the room isn't opened", () => {
        props.BoardApi = new TrelloApi();
        let wrapper = shallow(<Choices {...props}/>)
        const socket = {emit: jest.fn()}
        const roomKey = "123"
        wrapper.instance().room = new Room(socket, roomKey);
        let spy = spyOn(wrapper.instance(), 'cardClicked');
        wrapper.instance().handleCardClicked("side");
        expect(spy).toHaveBeenCalled();
        spy.calls.reset();
        wrapper.instance().room = null;
        wrapper.instance().handleCardClicked();
        expect(spy).toHaveBeenCalled();
    });

    it("getProgress return the correct value", () => {
        props.nodes = ["1", "2", "3", "4"];
        let wrapper = shallow(<Choices {...props}/>)
        spyOn(wrapper.instance().engine,'getListNodes').and.returnValue(["3","4"]);
        expect(wrapper.instance().getProgress()).toEqual(25);
    });

});