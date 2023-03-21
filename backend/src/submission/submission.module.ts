import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionnaireModule } from 'src/questionnaire/questionnaire.module';
import { QuestionResponse, Submission } from './entity';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';

@Module({
  controllers: [SubmissionController],
  providers: [SubmissionService],
  imports: [
    TypeOrmModule.forFeature([Submission, QuestionResponse]),
    QuestionnaireModule,
  ],
})
export class SubmissionModule {}
