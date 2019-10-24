import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { ContentCard } from '../../../../../../../../components/ContentCard/ContentCard';
import { LoadingState } from '../../../../../../../../components/LoadingState/LoadingState';
import { ChapterProblemCard, ChapterProblemCardProps } from '../ChapterProblemCard/ChapterProblemCard';
import { getProblemName } from '../../../../../../../../modules/api/sandalphon/problem';
import { Course } from '../../../../../../../../modules/api/jerahmeel/course';
import { CourseChapter } from '../../../../../../../../modules/api/jerahmeel/courseChapter';
import { ChapterProblemsResponse } from '../../../../../../../../modules/api/jerahmeel/chapterProblem';
import { AppState } from '../../../../../../../../modules/store';
import { selectCourse } from '../../../../../modules/courseSelectors';
import { selectCourseChapter } from '../../../modules/courseChapterSelectors';
import { chapterProblemActions as injectedChapterProblemActions } from '../modules/chapterProblemActions';

export interface ChapterProblemsPageProps {
  course: Course;
  chapter: CourseChapter;
  statementLanguage: string;
  onGetProblems: (chapterJid: string) => Promise<ChapterProblemsResponse>;
}

interface ChapterProblemsPageState {
  response?: ChapterProblemsResponse;
}

export class ChapterProblemsPage extends React.PureComponent<ChapterProblemsPageProps, ChapterProblemsPageState> {
  state: ChapterProblemsPageState = {};

  async componentDidMount() {
    const response = await this.props.onGetProblems(this.props.chapter.chapterJid);
    this.setState({ response });
  }

  render() {
    return (
      <ContentCard>
        <h3>Problems</h3>
        <hr />
        {this.renderProblems()}
      </ContentCard>
    );
  }

  private renderProblems = () => {
    const { response } = this.state;
    if (!response) {
      return <LoadingState />;
    }

    const { data: problems } = response;

    if (problems.length === 0) {
      return (
        <p>
          <small>No problems.</small>
        </p>
      );
    }

    return problems.map(problem => {
      const props: ChapterProblemCardProps = {
        course: this.props.course,
        chapter: this.props.chapter,
        problem,
        problemName: getProblemName(this.state.response!.problemsMap[problem.problemJid], 'id'),
      };
      return <ChapterProblemCard key={problem.problemJid} {...props} />;
    });
  };
}

export function createChapterProblemsPage(chapterProblemActions) {
  const mapStateToProps = (state: AppState) => ({
    course: selectCourse(state),
    chapter: selectCourseChapter(state).courseChapter,
  });

  const mapDispatchToProps = {
    onGetProblems: chapterProblemActions.getProblems,
  };

  return withRouter<any, any>(connect(mapStateToProps, mapDispatchToProps)(ChapterProblemsPage));
}

export default createChapterProblemsPage(injectedChapterProblemActions);