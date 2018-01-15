import React from "react";
import {shallow} from 'enzyme';
import ChoicesView from "./view/ChoicesView.jsx";

describe("Choices", () => {
  const choicesView = (props) => {
    return shallow(
      <ChoicesView {...props} />
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

  it("shows votes and continue buttons only after everybody in the room voted", () => {
    let props = {
      voters: {
        left: [{
          voterId: 'voter1',
          trelloId: 'voter1',
          trelloAvatar: ''
        }],
        right: [{
          voterId: 'voter2',
          trelloId: 'voter2',
          trelloAvatar: ''
        }]
      },
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
      },
      everybodyVoted: false,
      roomVoters: [{id: 'voter1', avatar: ''}, {id: 'voter2', avatar: ''}, {id: 'voter3', avatar: ''}],
      handleCardClicked: () => {
      },
    };
    let shallowChoices = choicesView(props)

    expect(shallowChoices.find('Card').at(0).props().voters).toEqual([])
    expect(shallowChoices.find('Card').at(1).props().voters).toEqual([])
    expect(shallowChoices.find('Card').at(0).props().continueButton).toEqual('')
    expect(shallowChoices.find('Card').at(1).props().continueButton).toEqual('')

  })

  it("shows votes and continue buttons only after everybody in the room voted", () => {
    let props = {
      voters: {
        left: [{
          voterId: 'voter1',
          trelloId: 'voter1',
          trelloAvatar: ''
        }],
        right: [{
          voterId: 'voter2',
          trelloId: 'voter2',
          trelloAvatar: ''
        }]
      },
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
      },
      everybodyVoted: true,
      roomVoters: [{id: 'voter1', avatar: ''}, {id: 'voter2', avatar: ''}],
      handleCardClicked: () => {
      },
    };
    let shallowChoices = choicesView(props)

    let actualLeftCardVoters = shallowChoices.find('Card').at(0).props().voters
    let actualRightCardVoters = shallowChoices.find('Card').at(1).props().voters
    let leftContinueButton = shallowChoices.find('Card').at(0).props().continueButton
    let rightContinueButton = shallowChoices.find('Card').at(1).props().continueButton
    expect(actualLeftCardVoters).toEqual(props.voters.left)
    expect(actualRightCardVoters).toEqual(props.voters.right)
    expect(leftContinueButton).not.toEqual('')
    expect(rightContinueButton).not.toEqual('')
  })
})