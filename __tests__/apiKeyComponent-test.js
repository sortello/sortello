jest.dontMock('../components/ApiKey.jsx');
import React from 'react';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ApiKey from '../components/ApiKey';

configure({ adapter: new Adapter() });

it('calls saveAPIKey on click', () => {
  let setApiKey = jest.fn();
  let Trello = jest.fn();
  const component = shallow(<ApiKey apiKey={"1a2b3c4d5e"} Trello={Trello} setApiKey={setApiKey} />);
  component.instance().saveAPIKey = jest.fn();
  const button = component.find('#check_api_key').first()
  button.simulate('click');
  expect(component.instance().saveAPIKey).toBeCalled();
});