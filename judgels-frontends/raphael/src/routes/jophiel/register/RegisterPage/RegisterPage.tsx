import * as React from 'react';
import { connect } from 'react-redux';

import RegisterForm, { RegisterFormData } from '../RegisterForm/RegisterForm';
import { Card } from '../../../../components/Card/Card';
import { SingleColumnLayout } from '../../../../components/layouts/SingleColumnLayout/SingleColumnLayout';
import { AppState } from '../../../../modules/store';
import { selectRecaptchaSiteKey, selectUserRegistrationUseRecaptcha } from '../../modules/webConfigSelectors';
import { UserRegistrationData } from '../../../../modules/api/jophiel/userAccount';
import { registerActions as injectedRegisterActions } from '../modules/registerActions';

import './RegisterPage.css';

export interface RegisterPageProps {
  onRegisterUser: (data: RegisterFormData) => Promise<void>;
  useRecaptcha: boolean;
  recaptchaSiteKey?: string;
}

interface RegisterPageState {
  registeredUser?: {
    username: string;
    email: string;
  };
}

export class RegisterPage extends React.PureComponent<RegisterPageProps, RegisterPageState> {
  state: RegisterPageState = {};

  render() {
    let content: JSX.Element;
    if (this.state.registeredUser) {
      content = (
        <Card title="Activation required" className="card-register">
          <p>
            Thank you for registering, <strong>{this.state.registeredUser.username}</strong>.
          </p>
          <p data-key="instruction" className="card-register__instruction">
            A confirmation email has been sent to&nbsp;
            <strong>{this.state.registeredUser.email}</strong> with instruction to activate your account.
          </p>
          <p>Please check your inbox/spam.</p>
        </Card>
      );
    } else {
      const registerFormProps = {
        useRecaptcha: this.props.useRecaptcha,
        recaptchaSiteKey: this.props.recaptchaSiteKey,
      };
      content = (
        <Card title="Register" className="card-register">
          <RegisterForm onSubmit={this.onRegisterUser} {...registerFormProps} />
        </Card>
      );
    }

    return <SingleColumnLayout>{content}</SingleColumnLayout>;
  }

  private onRegisterUser = async (data: RegisterFormData) => {
    await this.props.onRegisterUser(data);
    this.setState({
      registeredUser: {
        username: data.username,
        email: data.email,
      },
    });
  };
}

export function createRegisterPage(registerActions) {
  const mapStateToProps = (state: AppState) => ({
    useRecaptcha: selectUserRegistrationUseRecaptcha(state),
    recaptchaSiteKey: selectRecaptchaSiteKey(state),
  });

  const mapDispatchToProps = {
    onRegisterUser: (data: RegisterFormData) => {
      const userRegistrationData: UserRegistrationData = {
        username: data.username,
        password: data.password,
        email: data.email,
        name: data.name,
        recaptchaResponse: data.recaptchaResponse,
      };
      return registerActions.registerUser(userRegistrationData);
    },
  };

  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/19989
  const RegisterWrapper = (props: RegisterPageProps) => <RegisterPage {...props} />;

  return connect(mapStateToProps, mapDispatchToProps)(RegisterWrapper);
}

export default createRegisterPage(injectedRegisterActions);