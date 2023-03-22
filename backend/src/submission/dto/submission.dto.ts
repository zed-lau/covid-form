import { IsInt } from 'class-validator';
import { IsValidResponses } from '../../common/decorator/IsValidResponses';
import { ISubmissionDto } from '../../types';

export class SubmissionDto implements ISubmissionDto {
  constructor(questionnaireId: number, responses: Record<string, string>) {
    this.questionnaireId = questionnaireId;
    this.responses = responses;
  }

  @IsInt()
  readonly questionnaireId: number;

  @IsValidResponses('questionnaireId')
  readonly responses: Record<string, string>;
}
