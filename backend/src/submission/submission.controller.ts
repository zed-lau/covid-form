import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionDto } from './dto/submission.dto';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly service: SubmissionService) {}

  @Get('responses')
  getSubmissionResponses(@Query('questionnaireId') questionnaireId: number) {
    return this.service.getSubmissionResponses(questionnaireId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() submissionDto: SubmissionDto) {
    return this.service.create(submissionDto);
  }
}
