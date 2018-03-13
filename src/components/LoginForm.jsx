import React from 'react';
import { TextField, RaisedButton } from 'material-ui';

import __ from '../utils/i18n';
import { EMAIL_REQ_VALIDATION, INVALID_EMAIL, PASSWORD_REQUIRED_VALIDATION } from '../constants';


export default class LoginForm extends React.Component {

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
      password: { value: '' },
    });
  }

  validate() {
    const { email, password } = this.state;

    if (email.value === '') {
      email.error = __(EMAIL_REQ_VALIDATION);
    }

    if (email.value !== '' && /\S+@\S+$/.test(email.value) === false) {
      email.error = __(INVALID_EMAIL);
    }

    if (password.value === '') {
      password.error = __(PASSWORD_REQUIRED_VALIDATION);
    }

    this.setState({ email, password });
    return !(email.error || password.error);
  }

  handleTextChange = field => (event) => {
    const newState = {};
    newState[field] = { value: event.target.value };
    this.setState(newState);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.validate()) {
      const { email, password } = this.state;
      localStorage.setItem('accountEmail', email.value);
      this.props.onSubmit({
        email: email.value,
        password: password.value,
      });
    }
  }

  render() {
    const { email, password } = this.state;
    const { invertedTextField } = this.context.muiTheme;
    const { loading } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          type="email"
          style={{ width: 250 }}
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
        <TextField
          type="password"
          value={password.value}
          style={{ width: 250 }}
          inputStyle={invertedTextField.inputStyle}
          hintStyle={invertedTextField.hintStyle}
          underlineStyle={invertedTextField.underlineStyle}
          underlineFocusStyle={invertedTextField.underlineFocusStyle}
          onChange={this.handleTextChange('password')}
          hintText={__('Password')}
          errorText={password.error}
          maxLength="35"
        />
        <br />
        <br />
        <RaisedButton
          type="submit"
          style={{ width: 250 }}
          secondary
          disabled={loading}
          label={loading ? __('Logging in...') : __('Login')}
        />
      </form>
    );
  }
}
