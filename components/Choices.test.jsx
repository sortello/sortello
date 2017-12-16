import React from "react";
import {shallow} from 'enzyme';
import Choices from "./Choices";

describe("Choices", () => {
  let props;
  let shallowChoices;
  const choices = () => {
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
    choices().instance().addVoter('voter1', '')
    choices().instance().addVoter('voter2', '')
    choices().instance().addVoter('voter3', '')
    expect(choices().instance().state.roomVoters.length).toEqual(3);
    choices().instance().removeVoter('voter2')
    expect(choices().instance().state.roomVoters.length).toEqual(2);
  });

  it("updates state after everybody has voted", () => {
    let component = choices().instance()
    component.addVoter('voter1', '')
    component.addVoter('voter2', '')
    component.addVoter('voter3', '')
    component.registerVote('node', 'voter0', '') // Room opener does not count as room voter ATM
    component.registerVote('node', 'voter1', '')
    expect(component.state.everyBodyVoted).toBe(false)
    component.registerVote('node', 'voter2', '')
    expect(component.state.everyBodyVoted).toBe(false)
    component.registerVote('compareNode', 'voter3', '')
    expect(component.state.everyBodyVoted).toBe(true)
  })

  it("shows votes and continue buttons only after everybody in the room voted", () => {
    let component = choices().instance()
    component.setState({
      leftCard: {
        left: null,
        right: null,
        value: '1',
        isPositioned: false
      },
      rightCard: {
        left: null,
        right: null,
        value: '2',
        isPositioned: false
      }
    })

    component.addVoter('voter1', '')
    component.addVoter('voter2', '')
    component.addVoter('voter3', '')

    component.registerVote('node', 'voter1', '')
    component.registerVote('compareNode', 'voter2', '')
    component.handleCardClicked('node')

    expect(choices().find('Card').at(0).props().voters).toEqual([])
    expect(choices().find('Card').at(1).props().voters).toEqual([])
    expect(choices().find('Card').at(0).props().continueButton).toEqual('')
    expect(choices().find('Card').at(1).props().continueButton).toEqual('')

    component.registerVote('node', 'voter3', '')

    expect(choices().find('Card').at(0).props().voters).toEqual(
      [
        {voterId: 'voter1', trelloId: 'voter1', trelloAvatar: ''},
        {voterId: undefined, trelloId:  undefined, trelloAvatar:  undefined},
        {voterId: 'voter3', trelloId: 'voter3', trelloAvatar: ''}
      ]
    )
    expect(choices().find('Card').at(1).props().voters).toEqual([{
      voterId: 'voter2',
      trelloId: 'voter2',
      trelloAvatar: ''
    }])
    expect(choices().find('Card').at(0).props().continueButton).not.toEqual('')
    expect(choices().find('Card').at(1).props().continueButton).not.toEqual('')
  })

});