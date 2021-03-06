import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { Card } from '../../../../components/Card/Card';
import { SingleColumnLayout } from '../../../../components/SingleColumnLayout/SingleColumnLayout';

import ResetPasswordForm, { ResetPasswordFormData } from '../ResetPasswordForm/ResetPasswordForm';
import { resetPasswordActions as injectedResetPasswordActions } from '../modules/resetPasswordActions';

export interface ResetPasswordPageProps {
  onResetPassword: (data: ResetPasswordFormData) => Promise<void>;
}

export const ResetPasswordPage = (props: ResetPasswordPageProps) => (
  <SingleColumnLayout>
    <Card title="Reset password">
      <ResetPasswordForm onSubmit={props.onResetPassword} />
    </Card>
  </SingleColumnLayout>
);

interface ResetPasswordContainerProps extends RouteComponentProps<{ emailCode: string }> {
  onResetPassword: (emailCode: string, data: ResetPasswordFormData) => Promise<void>;
}

const ResetPasswordPageContainer = (props: ResetPasswordContainerProps) => {
  const onResetPassword = (data: ResetPasswordFormData) => props.onResetPassword(props.match.params.emailCode, data);
  return <ResetPasswordPage onResetPassword={onResetPassword} />;
};

export function createResetPasswordPage(resetPasswordActions) {
  const mapDispatchToProps = {
    onResetPassword: (emailCode: string, data: ResetPasswordFormData) =>
      resetPasswordActions.resetPassword(emailCode, data.password),
  };

  return withRouter<any, any>(connect(undefined, mapDispatchToProps)(ResetPasswordPageContainer));
}

export default createResetPasswordPage(injectedResetPasswordActions);
