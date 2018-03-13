import React from 'react';
import { shallow } from 'enzyme';
import { CircularProgress } from 'material-ui';

import BlindClaimModal from '../../src/components/BlindClaimModal';


describe('BlindClaimModal test cases', () => {
  let wrapper = null;
  let modalContent = null;
  const context = { router: {} };

  beforeEach(() => {
    wrapper = shallow(<BlindClaimModal />, { context });
  });

  afterEach(() => {
    wrapper = null;
  });

  it('Modal content on error.', () => {
    wrapper.setState({ claimError: true });
    modalContent = wrapper.find('div');
    // Only error msg
    expect(modalContent).to.have.length.of(1);
    expect(modalContent.node.props.children[1]).to.equal('Connection to device failed, try claiming the device again.');
  });

  it('Modal actions on error.', () => {
    wrapper.setState({ claimError: true });
    // Only Ok modal action
    expect(wrapper.node.props.actions).to.have.length.of(1);
  });

  it('Modal content on savingBlind.', () => {
    wrapper.setState({ savingBlind: true });
    modalContent = wrapper.find('div');
    // Connecting modal
    expect(modalContent).to.have.length.of(2);
    expect(wrapper.find(CircularProgress)).to.exist;
    expect(wrapper.find(CircularProgress)).to.have.length.of(1);
    expect(wrapper.find('.connectingModalContent')).to.have.length.of(1);
  });

  it('Modal content on connected stae.', () => {
    wrapper.setState({ connectionState: 'connected' });
    modalContent = wrapper.find('div');
    // Blind connected
    expect(modalContent).to.have.length.of(4);
    expect(wrapper.find('div').at(1).node.props.children).to.equal('Press and hold the small button on the side of the blind until it jogs.');
    expect(wrapper.find('img')).to.have.length.of(1);
  });
});
