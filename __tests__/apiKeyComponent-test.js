jest.dontMock('../components/ApiKey.jsx');
import React from 'react';
import {shallow} from 'enzyme';
import ApiKey from '../components/ApiKey';
import ReactTestUtils from 'react-addons-test-utils'

it('calls saveAPIKey on click', () => {
  var setApiKey = jest.fn();
  var Trello = jest.fn();
  const component = shallow(<ApiKey apiKey={"1a2b3c4d5e"} Trello={Trello} setApiKey={setApiKey} />);
  component.instance().saveAPIKey = jest.fn();
  const button = component.find('#check_api_key').first()
  button.simulate('click');
  expect(component.instance().saveAPIKey).toBeCalled();
});