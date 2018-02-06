import React from "react";
import {shallow} from 'enzyme';
import Choices from "./Choices";

describe("Choices", () => {
    let props;
    let shallowChoices;
    const wrapper = () => {
        if (!shallowChoices) {
            shallowChoices = shallow(
                <Choices {...props} />
            );
        }
        return shallowChoices;
    }

    beforeEach(() => {
        jest.mock(
            '../trello',
            () => {
                return {
                    members: {
                        get: jest.fn(() => 42)
                    }
                };
            },
            {virtual: true},
        );
        const trello = require('../trello')
        props = {
            Trello: trello,
            setSortedRootNode: null,
            setStartTimeStamp: null,
            nodes: [],
            rootNode: null
        };
        shallowChoices = undefined;
    });

    it("adds and removes voters", () => {

        wrapper().instance().castRoomVoters = jest.fn();
        wrapper().instance().addVoter('voter1', '')
        wrapper().instance().addVoter('voter2', '')
        wrapper().instance().addVoter('voter3', '')
        expect(wrapper().instance().state.roomVoters.length).toEqual(3);
        wrapper().instance().removeVoter('voter2')
        expect(wrapper().instance().state.roomVoters.length).toEqual(2);
    });

    it("updates state after everybody has voted", () => {
        let component = wrapper().instance()
        component.castRoomVoters = jest.fn();
        component.addVoter('voter1', '')
        component.addVoter('voter2', '')
        component.addVoter('voter3', '')
        component.registerVote('node', 'voter0', '') // Room opener does not count as room voter ATM
        component.registerVote('node', 'voter1', '')
        expect(component.state.everybodyVoted).toBe(false)
        component.registerVote('node', 'voter2', '')
        expect(component.state.everybodyVoted).toBe(false)
        component.registerVote('compareNode', 'voter3', '')
        expect(component.state.everybodyVoted).toBe(true)
    })

});