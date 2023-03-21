export type QuestionType = "OneOption" | "FreeText";

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
}
interface QuestionOption {
  value: string;
}

export interface Submission {
  questionnaireId: number;
  responses: Record<string, string>;
}

export interface QuestionnaireResponse {
  questionId: string;
  value: string;
}
