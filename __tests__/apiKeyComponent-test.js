jest.dontMock('../components/Authentication.jsx');
import React from 'react';
import {shallow} from 'enzyme';
import Authentication from '../components/Authentication';

it('calls saveAPIKey on click', () => {
  let setApiKey = jest.fn();
  let Trello = jest.fn();
  const component = shallow(<Authentication apiKey={"1a2b3c4d5e"} Trello={Trello} setApiKey={setApiKey} />);
  component.instance().saveAPIKey = jest.fn();
  const button = component.find('#check_api_key').first()
  button.simulate('click');
  expect(component.instance().saveAPIKey).toBeCalled();
});