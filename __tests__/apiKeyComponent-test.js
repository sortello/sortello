jest.dontMock('../components/ApiKey.jsx');
import React from 'react';
import {shallow} from 'enzyme';
import ApiKey from '../components/ApiKey';

it('calls saveAPIKey on click', () => {
  let setApiKey = jest.fn();
  let Trello = jest.fn();
  const component = shallow(<ApiKey apiKey={"1a2b3c4d5e"} Trello={Trello} setApiKey={setApiKey} />);
  component.instance().saveAPIKey = jest.fn();
  const button = component.find('#check_api_key').first()
  button.simulate('click');
  expect(component.instance().saveAPIKey).toBeCalled();
});