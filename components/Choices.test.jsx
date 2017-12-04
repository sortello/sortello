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
      setSortedRootNode: undefined,
      setStartTimeStamp: undefined,
      nodes: undefined,
      rootNode: undefined
    };
    shallowChoices = undefined;
  });

  it("adds and removes voters", () => {
    choices().instance().addVoter('voter1', 'avatar1')
    choices().instance().addVoter('voter2', 'avatar2')
    choices().instance().addVoter('voter3', 'avatar3')
    expect(choices().instance().state.roomVoters.length).toEqual(3);
    choices().instance().removeVoter('voter2')
    expect(choices().instance().state.roomVoters.length).toEqual(2);
  });
});