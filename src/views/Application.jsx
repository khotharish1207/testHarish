
// This is the application wrapper, it controls the Theme and the Locale.

import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import baseTheme from '../style/muiThemes/neo';


export default class Application extends React.Component {

  static childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  }

  static propTypes = {
    children: React.PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props);
    // Eventually these states should follow changes from the AppStore
    this.state = {
      theme: 'neo',
      selectedLocale: 'en',
    };
  }

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }

  render() {
    return (
      <div
        className={`${this.state.theme || ''}`}
        data-locale={this.state.selectedLocale}
      >
        {this.props.children}
      </div>
    );
  }
}
