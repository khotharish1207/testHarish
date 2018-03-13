import React from 'react';
import { TextField, RaisedButton } from 'material-ui';

import __ from '../utils/i18n';


export default class RecoverForm extends React.Component {

  static propTypes = {
    onSubmit: React.PropTypes.func,
    loading: React.PropTypes.bool,
  };

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  };

  static defaultProps = {
    loading: false,
  }

  componentWillMount() {
    let email = '';

    if (localStorage.accountEmail !== undefined) {
      email = localStorage.getItem('accountEmail');
    }

    this.setState({
      email: { value: email },
    });
  }

  handleTextChange = field => (event) => {
    const newState = {};
    newState[field] = { value: event.target.value };
    this.setState(newState);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.validate()) {
      const { email } = this.state;

      this.props.onSubmit({
        email: email.value,
      });
    }
  }

  validate() {
    const { email } = this.state;

    if (email.value === '') {
      email.error = __('Email is required');
    }

    if (email.value !== '' && /\S+@\S+$/.test(email.value) === false) {
      email.error = __('Invalid Email');
    }

    this.setState({ email });
    return !(email.error);
  }

  render() {
    const { loading } = this.props;
    const { email } = this.state;
    const { invertedTextField } = this.context.muiTheme;

    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          type="email"
          inputStyle={invertedTextField.inputStyle}
          hintStyle={invertedTextField.hintStyle}
          underlineStyle={invertedTextField.underlineStyle}
          underlineFocusStyle={invertedTextField.underlineFocusStyle}
          value={email.value}
          onChange={this.handleTextChange('email')}
          hintText={__('Email')}
          errorText={email.error}
          maxLength="50"
        />
        <br />
        <br />
        <RaisedButton
          type="submit"
          style={{ margin: 10 }}
          secondary
          disabled={loading}
          label={__('Send reset password link')}
        />
        <br />
        <br />
      </form>
    );
  }
}
