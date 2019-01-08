import React from "react";
import {shallow} from 'enzyme';
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

    it("show the open/share room if socket is declared", () => {
        const socket = {emit: jest.fn()}
        const roomKey = "123"
        let wrapper = shallow(<Choices {...props}/>);
        wrapper.instance().room = new Room(socket,roomKey)
        wrapper.instance().socket = true;
        let output = wrapper.instance().renderNewRoomButton();
        expect(output).not.toEqual("");
    });

    it("show 'Share room' if socket and room are initialized", () => {
        const socket = {emit: jest.fn()}
        const roomKey = "123"
        let wrapper = shallow(<Choices {...props}/>);
        wrapper.instance().room = new Room(socket,roomKey);
        wrapper.instance().socket = true;
        let output = wrapper.instance().renderNewRoomButton();
        wrapper = shallow(output);
        expect(wrapper.find("div").at(2).props().children).toEqual("Share room");
    });

    it("show 'Open room' if socket is initialized but not the room", () => {
        let wrapper = shallow(<Choices {...props}/>);
        wrapper.instance().room = null;
        wrapper.instance().socket = true;
        let output = wrapper.instance().renderNewRoomButton();
        wrapper = shallow(output);
        expect(wrapper.find("div").at(2).props().children).toEqual("Open new room");
    });

    it("create room if room isn't defined",() => {
        let wrapper = shallow(<Choices {...props}/>)
        const socket = {emit: jest.fn()}
        const roomKey = "123"
        wrapper.instance().room = new Room(socket,roomKey);
        let spy = spyOn(wrapper.instance().room, 'open');
        let spy2 = spyOn(wrapper.instance().room, 'listenSocket');
        wrapper.instance().createRoom();
        expect(spy).not.toHaveBeenCalled();
        expect(spy2).not.toHaveBeenCalled();

        wrapper.instance().socket = {
            emit: jest.fn(),
            on: jest.fn()}
        wrapper.instance().room = null;
        wrapper.instance().createRoom();
        expect(wrapper.instance().room).toBeTruthy();
    })

    it("set variable 'setEverybodyVoted' to false if room isn't declared", () => {
        let wrapper = shallow(<Choices {...props}/>)
        const socket = {emit: jest.fn()}
        const roomKey = "123"
        wrapper.instance().room = new Room(socket,roomKey)
        let spy = spyOn(wrapper.instance().room, 'setEverybodyVoted');
        let spy2 = spyOn(wrapper.instance().room, 'castVotesInfo');
        let spy3 = spyOn(wrapper.instance(), 'checkEnded');
        wrapper.instance().room = null;
        wrapper.instance().getNextChoice();
        expect(spy).not.toHaveBeenCalled();
        expect(spy2).not.toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
    })

    /*TODO la parte primaria che ho messo in commento*/
    it("set the correct values of leftCard and rightCard when prioritization is not ended", () => {
        let wrapper = shallow(<Choices {...props}/>)
        const node = "[1]"
        const compareNode = "[2]"
        wrapper.instance().engine = new Engine("[[1][2]]","[1]");
        let spy = spyOn(wrapper.instance().engine, 'autoChoice').and.returnValue(false);
        wrapper.instance().engine.ended = false;
        wrapper.instance().engine.node = node;
        wrapper.instance().engine.compareNode = compareNode;
        wrapper.instance().checkEnded();
        expect(wrapper.instance().state.leftCard).toEqual(node)
        expect(wrapper.instance().state.rightCard).toEqual(compareNode)
        expect(spy).toHaveBeenCalled();

        /*let spy = spyOn (wrapper.instance().props,"setSortedRootNode")
        wrapper.instance().engine.ended = true;
        wrapper.instance().checkEnded();
        expect(spy).toHaveBeenCalled();*/
    })

});