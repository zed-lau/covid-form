export interface ISubmissionDto {
  questionnaireId: number;
  responses: Record<string, string>;
}

export interface IQuestionResponse {
  questionId: number;
  value: string;
  submissionId: number;
}
