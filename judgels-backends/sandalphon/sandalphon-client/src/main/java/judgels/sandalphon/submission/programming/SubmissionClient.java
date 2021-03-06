package judgels.sandalphon.submission.programming;

import static judgels.sandalphon.submission.programming.SubmissionUtils.checkAllSourceFilesPresent;
import static judgels.sandalphon.submission.programming.SubmissionUtils.checkGradingLanguageAllowed;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import judgels.gabriel.api.GradingRequest;
import judgels.gabriel.api.LanguageRestriction;
import judgels.gabriel.api.SubmissionSource;
import judgels.sandalphon.api.problem.programming.ProblemSubmissionConfig;
import judgels.sandalphon.api.submission.programming.Submission;
import judgels.sandalphon.api.submission.programming.SubmissionData;
import judgels.sealtiel.api.message.MessageData;
import judgels.sealtiel.api.message.MessageService;
import judgels.service.api.client.BasicAuthHeader;

public class SubmissionClient {
    private final SubmissionStore submissionStore;
    private final BasicAuthHeader sealtielClientAuthHeader;
    private final MessageService messageService;
    private final String gabrielClientJid;
    private final ObjectMapper mapper;

    public SubmissionClient(
            SubmissionStore submissionStore,
            BasicAuthHeader sealtielClientAuthHeader,
            MessageService messageService,
            String gabrielClientJid,
            ObjectMapper mapper) {

        this.submissionStore = submissionStore;
        this.sealtielClientAuthHeader = sealtielClientAuthHeader;
        this.messageService = messageService;
        this.gabrielClientJid = gabrielClientJid;
        this.mapper = mapper;
    }

    public Submission submit(
            SubmissionData data,
            SubmissionSource source,
            ProblemSubmissionConfig config) {

        LanguageRestriction restriction = config.getGradingLanguageRestriction();
        if (data.getAdditionalGradingLanguageRestriction().isPresent()) {
            restriction = LanguageRestriction.combine(
                    restriction,
                    data.getAdditionalGradingLanguageRestriction().get());
        }

        checkAllSourceFilesPresent(source, config);
        checkGradingLanguageAllowed(
                config.getGradingEngine(),
                data.getGradingLanguage(),
                restriction);

        Submission submission = submissionStore.createSubmission(data, config.getGradingEngine());
        String gradingJid = submissionStore.createGrading(submission);
        requestGrading(gradingJid, submission, source);

        return submission;
    }

    public void requestGrading(String gradingJid, Submission submission, SubmissionSource source) {
        GradingRequest gradingRequest = new GradingRequest.Builder()
                .gradingJid(gradingJid)
                .problemJid(submission.getProblemJid())
                .gradingEngine(submission.getGradingEngine())
                .gradingLanguage(submission.getGradingLanguage())
                .submissionSource(source)
                .build();

        MessageData data;
        try {
            data = new MessageData.Builder()
                    .targetJid(gabrielClientJid)
                    .type(GradingRequest.class.getSimpleName())
                    .content(mapper.writeValueAsString(gradingRequest))
                    .build();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        messageService.sendMessage(sealtielClientAuthHeader, data);
    }
}
