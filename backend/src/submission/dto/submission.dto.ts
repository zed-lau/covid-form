import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidResponses } from '../../common/decorator/IsValidResponses';
import { ISubmissionDto } from '../../types';

export class SubmissionDto implements ISubmissionDto {
  constructor(questionnaireId: number, responses: Record<string, string>) {
    this.questionnaireId = questionnaireId;
    this.responses = responses;
  }

  @ApiProperty()
  @IsInt()
  readonly questionnaireId: number;

  @ApiProperty()
  @IsValidResponses('questionnaireId')
  readonly responses: Record<string, string>;
}
