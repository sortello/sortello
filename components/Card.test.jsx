import React from "react";
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Card from "./Card.jsx";

configure({ adapter: new Adapter() });

describe("Card", () => {
  const card = (props) => {
    return shallow(
      <Card {...props} />
    );
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
  });

  it("hide votes and continue buttons before everybody in the room voted", () => {
    let props = {
      voters:
        [{
          voterId: 'voter1',
          trelloId: 'voter1',
          trelloAvatar: ''
        }, {
          voterId: 'voter2',
          trelloId: 'voter2',
          trelloAvatar: ''
        }]
      ,
      data: {
        id: 2,
        shortUrl: "#",
        name: "Right card with some text",
        labels: [
          {
            color: "green",
            name: "Label",
            id: 3
          },
          {
            color: "yellow",
            name: "Label",
            id: 4
          }
        ]
      },
      everybodyVoted: false,
      handleCardClicked: () => {
      },
    };
    let wrapper = card(props)

    expect(wrapper.find('CardVoters').exists()).toEqual(false);
    expect(wrapper.find('.card-button__continue').exists()).toEqual(false)

  })

  it("shows votes and continue buttons after everybody in the room voted", () => {
    let props = {
      voters:
        [{
          voterId: 'voter1',
          trelloId: 'voter1',
          trelloAvatar: ''
        }, {
          voterId: 'voter2',
          trelloId: 'voter2',
          trelloAvatar: ''
        }]
      ,
      data: {
        id: 2,
        shortUrl: "#",
        name: "Right card with some text",
        labels: [
          {
            color: "green",
            name: "Label",
            id: 3
          },
          {
            color: "yellow",
            name: "Label",
            id: 4
          }
        ]
      },
      everybodyVoted: true,
      handleCardClicked: () => {
      },
    };
    let wrapper = card(props)

    expect(wrapper.find('CardVoters').exists()).toEqual(true);
    expect(wrapper.find('CardVoters').props().voters).toEqual(props.voters)
    expect(wrapper.find('CardButtons').props().continueButton).not.toBe(null)
  })
})
