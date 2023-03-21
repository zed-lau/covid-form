import { IsInt, IsNotEmptyObject } from 'class-validator';
import { ISubmissionDto } from '../../types';

export class SubmissionDto implements ISubmissionDto {
  constructor(questionnaireId: number, responses: Record<string, string>) {
    this.questionnaireId = questionnaireId;
    this.responses = responses;
  }

  @IsInt()
  readonly questionnaireId: number;

  @IsNotEmptyObject()
  readonly responses: Record<string, string>;
}
