import React from "react";
import {mount} from "enzyme";
import Choices from "./Choices";

describe("Choices", () => {
  let props;
  let mountedChoices;
  const choices = () => {
    if (!mountedChoices) {
      mountedChoices = mount(
        <Choices {...props} />
      );
    }
    return mountedChoices;
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
    mountedChoices = undefined;
  });

  it("always renders a div", () => {
    const divs = choices().find("div");
    expect(divs.length).toBeGreaterThan(0);
  });
});