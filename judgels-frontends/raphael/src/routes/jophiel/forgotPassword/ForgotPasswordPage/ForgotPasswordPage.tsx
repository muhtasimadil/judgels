import * as React from 'react';
import { connect } from 'react-redux';

import { Card } from '../../../../components/Card/Card';
import { SingleColumnLayout } from '../../../../components/SingleColumnLayout/SingleColumnLayout';

import ForgotPasswordForm, { ForgotPasswordFormData } from '../ForgotPasswordForm/ForgotPasswordForm';
import { forgotPasswordActions as injectedForgotPasswordActions } from '../modules/forgotPasswordActions';

export interface ForgotPasswordPageProps {
  onForgetPassword: (data: ForgotPasswordFormData) => Promise<void>;
}

interface ForgotPasswordPageState {
  submitted: boolean;
}

export class ForgotPasswordPage extends React.PureComponent<ForgotPasswordPageProps, ForgotPasswordPageState> {
  state: ForgotPasswordPageState = { submitted: false };

  render() {
    let content: JSX.Element;

    if (this.state.submitted) {
      content = (
        <div>
          <p data-key="instruction">An email has been sent to your email with instruction to reset your password.</p>
          <p>Please check your inbox/spam.</p>
        </div>
      );
    } else {
      content = <ForgotPasswordForm onSubmit={this.onForgetPassword} />;
    }
    return (
      <SingleColumnLayout>
        <Card title="Forgot password">{content}</Card>
      </SingleColumnLayout>
    );
  }

  private onForgetPassword = async (data: ForgotPasswordFormData) => {
    await this.props.onForgetPassword(data);
    this.setState({ submitted: true });
  };
}

export function createForgotPasswordPage(forgotPasswordActions) {
  const mapDispatchToProps = {
    onForgetPassword: (data: ForgotPasswordFormData) => forgotPasswordActions.requestToResetPassword(data.email),
  };

  return connect(undefined, mapDispatchToProps)(ForgotPasswordPage);
}

export default createForgotPasswordPage(injectedForgotPasswordActions);
