import { Submission } from '../sandalphon/submission';
import { UsersMap } from '../jophiel/user';
import { APP_CONFIG } from '../../../conf';
import { get } from '../http';
import { Page } from '../pagination';

export interface ContestSubmissionsResponse {
  data: Page<Submission>;
  usersMap: UsersMap;
  problemAliasesMap: { [problemJid: string]: string };
}

export function createContestSubmissionAPI() {
  const baseURL = `${APP_CONFIG.apiUrls.uriel}/submissions`;

  return {
    getMySubmissions: (token: string, contestJid: string, page: number): Promise<ContestSubmissionsResponse> => {
      return get(`${baseURL}/mine?contestJid=${contestJid}&page=${page}`, token);
    },
  };
}
