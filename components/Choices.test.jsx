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
    const Trello = require('../trello')
    props = {
      Trello: Trello,
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
    expect(choices.state.roomVoters.length).toEqual(2);
  });
});