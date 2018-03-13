import React from 'react';
import { shallow } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import BlindRemote from '../../src/components/BlindRemote';
import baseTheme from '../../src/style/muiThemes/neo';


describe('BlindRemote test cases', () => {
  let wrapper = null;
  let spyOpen = null;
  let spyStop = null;
  let spyClose = null;
  let spyFav = null;

  const context = { muiTheme: getMuiTheme(baseTheme) };
  const clickEvent = new Event('click');

  beforeEach(() => {
    spyOpen = chai.spy();
    spyStop = chai.spy();
    spyClose = chai.spy();
    spyFav = chai.spy();
  });

  it('should call props correctly', () => {
    wrapper = shallow(<BlindRemote
      onOpen={spyOpen}
      onStop={spyStop}
      onClose={spyClose}
      onFavourite={spyFav}
      disableStop={false}
      disableOpen={false}
      disableClose={false}
      disableFavourite={false}
    />, { context });

    wrapper.find('.remote-control-open').simulate('click', clickEvent);
    expect(spyOpen).to.have.been.called.once;

    wrapper.find('.remote-control-stop').simulate('click', clickEvent);
    expect(spyStop).to.have.been.called.once;

    wrapper.find('.remote-control-close').simulate('click', clickEvent);
    expect(spyClose).to.have.been.called.once;

    wrapper.find('.remote-control-fav').simulate('click', clickEvent);
    expect(spyFav).to.have.been.called.once;
  });

  it('should not call props function if control is disabled', () => {
    wrapper = shallow(<BlindRemote
      onOpen={spyOpen}
      onStop={spyStop}
      onClose={spyClose}
      onFavourite={spyFav}
      disableStop
      disableOpen
      disableClose
      disableFavourite
    />, { context });

    wrapper.find('.remote-control-open').simulate('click', clickEvent);
    expect(spyOpen).to.not.have.been.called();

    wrapper.find('.remote-control-stop').simulate('click', clickEvent);
    expect(spyStop).to.not.have.been.called();

    wrapper.find('.remote-control-close').simulate('click', clickEvent);
    expect(spyClose).to.not.have.been.called();

    wrapper.find('.remote-control-fav').simulate('click', clickEvent);
    expect(spyFav).to.not.have.been.called();
  });
});
