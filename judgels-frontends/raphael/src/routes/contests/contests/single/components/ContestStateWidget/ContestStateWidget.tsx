import { Alert, Button, Callout, Intent } from '@blueprintjs/core';
import * as React from 'react';
import { connect } from 'react-redux';

import { FormattedDuration } from '../../../../../../components/FormattedDuration/FormattedDuration';
import { Contest } from '../../../../../../modules/api/uriel/contest';
import { ContestState } from '../../../../../../modules/api/uriel/contestWeb';
import { AppState } from '../../../../../../modules/store';

import { selectContest } from '../../../modules/contestSelectors';
import { selectContestWebConfig } from '../../../modules/contestWebConfigSelectors';
import { contestWebActions as injectedContestWebConfigActions } from '../../modules/contestWebActions';
import { contestActions as injectedContestActions } from '../../../modules/contestActions';

import './ContestStateWidget.css';

export interface ContestStateWidgetProps {
  contest: Contest;
  state: ContestState;
  remainingStateDuration?: number;
  onGetContestWebConfig: (contestJid: string) => Promise<void>;
  onStartVirtualContest: (contestJid: string) => Promise<void>;
}

interface ContestStateWidgetState {
  baseRemainingDuration?: number;
  baseTimeForRemainingDuration?: number;
  remainingDuration?: number;
  isVirtualContestAlertOpen?: boolean;
  isVirtualContestButtonLoading?: boolean;
}

// TODO(fushar): unit tests
class ContestStateWidget extends React.PureComponent<ContestStateWidgetProps, ContestStateWidgetState> {
  state: ContestStateWidgetState = {};

  private currentTimeout;

  componentDidUpdate(prevProps: ContestStateWidgetProps) {
    if (prevProps.remainingStateDuration !== this.props.remainingStateDuration) {
      this.setUpBaseRemainingDuration();
    }
  }

  componentDidMount() {
    this.setUpBaseRemainingDuration();
    this.refreshRemainingDuration();
  }

  componentWillUnmount() {
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
    }
  }

  render() {
    const { leftComponent, rightComponent } = this.getWidgetComponents();
    return (
      <Callout intent={Intent.PRIMARY} className="secondary-info">
        <div className="contest-state-widget__left">{leftComponent}</div>
        <div className="contest-state-widget__right">{rightComponent}</div>
        <div className="clearfix" />
        {this.renderVirtualContestAlert()}
      </Callout>
    );
  }

  private renderVirtualContestAlert = () => (
    <Alert
      isOpen={this.state.isVirtualContestAlertOpen || false}
      confirmButtonText="Yes, start my participation"
      onConfirm={this.startVirtualContest}
      cancelButtonText="Cancel"
      onCancel={this.cancelVirtualContest}
      intent={Intent.WARNING}
      icon="time"
    >
      Are you sure you want to start your participation in this contest?
    </Alert>
  );

  private getWidgetComponents = (): any => {
    const state = this.props.state;

    if (state === ContestState.NotBegun) {
      return {
        leftComponent: <span>Contest hasn't started yet.</span>,
        rightComponent: !!this.state.remainingDuration && <span>Starts in {this.getRemainingDuration()}</span>,
      };
    }
    if (state === ContestState.Begun) {
      return {
        leftComponent: (
          <Button
            small
            intent={Intent.WARNING}
            onClick={this.alertVirtualContest}
            loading={this.state.isVirtualContestButtonLoading}
          >
            Click here to start your participation
          </Button>
        ),
        rightComponent: !!this.state.remainingDuration && <span>Ends in {this.getRemainingDuration()}</span>,
      };
    }
    if (state === ContestState.Started) {
      return {
        leftComponent: <span>Contest is running.</span>,
        rightComponent: !!this.state.remainingDuration && <span>Ends in {this.getRemainingDuration()}</span>,
      };
    }
    if (state === ContestState.Finished) {
      return {
        leftComponent: <span>Contest is over.</span>,
      };
    }
    if (state === ContestState.Paused) {
      return {
        leftComponent: <span>Contest is paused.</span>,
      };
    }
    return {};
  };

  private getRemainingDuration = () => {
    return <FormattedDuration value={this.state.remainingDuration!} />;
  };

  private refreshRemainingDuration = () => {
    const {
      remainingDuration: prevRemainingDuration,
      baseRemainingDuration,
      baseTimeForRemainingDuration,
    } = this.state;
    const remainingDuration = Math.max(
      0,
      baseRemainingDuration! + baseTimeForRemainingDuration! - new Date().getTime()
    );
    this.setState({ remainingDuration });

    if (remainingDuration === 0 && prevRemainingDuration !== 0) {
      this.props.onGetContestWebConfig(this.props.contest.jid);
    }

    this.currentTimeout = setTimeout(() => this.refreshRemainingDuration(), 500);
  };

  private setUpBaseRemainingDuration = () => {
    this.setState({
      baseRemainingDuration: this.props.remainingStateDuration,
      baseTimeForRemainingDuration: new Date().getTime(),
    });
  };

  private alertVirtualContest = () => {
    this.setState({ isVirtualContestAlertOpen: true });
  };

  private cancelVirtualContest = () => {
    this.setState({ isVirtualContestAlertOpen: false, isVirtualContestButtonLoading: false });
  };

  private startVirtualContest = async () => {
    this.setState({ isVirtualContestAlertOpen: false, isVirtualContestButtonLoading: true });
    await this.props.onStartVirtualContest(this.props.contest.jid);
    await this.props.onGetContestWebConfig(this.props.contest.jid);
    this.setState({ isVirtualContestButtonLoading: false });
  };
}

export function createContestStateWidget(contestWebActions, contestActions) {
  const mapStateToProps = (state: AppState) =>
    ({
      contest: selectContest(state)!,
      state: selectContestWebConfig(state)!.state,
      remainingStateDuration: selectContestWebConfig(state)!.remainingStateDuration,
    } as Partial<ContestStateWidgetProps>);

  const mapDispatchToProps = {
    onGetContestWebConfig: contestWebActions.getWebConfig,
    onStartVirtualContest: contestActions.startVirtualContest,
  };

  return connect(mapStateToProps, mapDispatchToProps)(ContestStateWidget);
}

export default createContestStateWidget(injectedContestWebConfigActions, injectedContestActions);
