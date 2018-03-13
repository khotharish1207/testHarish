import React from 'react';
import { shallow } from 'enzyme';
import { Slider } from 'material-ui';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from '../../src/style/muiThemes/neo';
import FavPositionSlider from '../../src/components/FavPositionSlider';


describe('FavPositionSlider test cases', () => {
  let wrapper = null;
  const context = { muiTheme: getMuiTheme(baseTheme) };
  const onChangeSpy = chai.spy();
  const onDragStopSpy = chai.spy();
  const value = 50;

  beforeEach(() => {
    wrapper = shallow(<FavPositionSlider
      onChange={onChangeSpy}
      onDragStop={onDragStopSpy}
      defaultValue={value}
    />, { context });
  });

  afterEach(() => {
    wrapper = null;
  });

  it('Existance of slider', () => {
    expect(wrapper.find(Slider)).to.exist;
    expect(wrapper.find(Slider)).to.have.length.of(1);
  });

  it('Slider value should same as defaultValue prop', () => {
    expect(wrapper.find(Slider).node.props.value).to.equal(value);
  });

  it('onChange should call', () => {
    wrapper.find(Slider).simulate('change', new Event('change'));
    expect(onChangeSpy).to.have.been.called.once;
  });

  it('onDragStop should call', () => {
    // wrapper.find(Slider).simulate('dragend', new Event('dragend'));
    wrapper.instance().onDragStop(new Event('dragend'));
    expect(onDragStopSpy).to.have.been.called.once;
  });
});
