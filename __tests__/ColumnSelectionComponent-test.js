jest.dontMock('../components/ApiKey.jsx');
import React from 'react';
import {mount} from 'enzyme';
import ColumnSelection from '../components/ColumnSelection';
import ReactTestUtils from 'react-addons-test-utils'

it('shows error on click if apiKey field empty', () => {
  // var Trello = jest.fn();
  // var handleCards = jest.fn();
  // const component = mount(
  //     <ColumnSelection apikey={"1a2b3c4d5e"} Trello={Trello} handleCards={handleCards}/>
  // );
  // component.instance().retrieveCards = jest.fn()
  // component.instance().handleWrongUrl = jest.fn()
  //
  // const columnButton = component.find('#retrieve_cards').first()
  // const columnInput = component.find('#card_url').first()
  //
  // columnButton.simulate('click')
  // expect(component.instance().handleWrongUrl).toBeCalled()
});


it('retrieves boards and lists if field is card url', () => {
  // var Trello = jest.fn();
  // var handleCards = jest.fn();
  // const component = mount(
  //     <ColumnSelection apikey={"1a2b3c4d5e"} Trello={Trello} handleCards={handleCards}/>
  // );
  //
  // component.instance().retrieveCards = jest.fn()
  //
  // const columnButton = component.find('#retrieve_cards').first()
  //
  // const columnInput = component.find('input').first();
  // columnInput.simulate('change', { target: { value: "https://trello.com/cw/5vfrQDSZ/14-four" } })
  // columnButton.simulate('click')
  // expect(component.instance().retrieveCards).toBeCalled()
});