import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionDto } from './dto/submission.dto';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly service: SubmissionService) {}

  @Get('responses')
  getSubmissionResponses() {
    return this.service.getSubmissionResponses();
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() submissionDto: SubmissionDto) {
    return this.service.create(submissionDto);
  }
}
