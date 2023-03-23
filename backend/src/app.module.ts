import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponsesValidator } from './common/decorator/IsValidResponses';
import { dataSourceOptions } from './db/datasource';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { SubmissionModule } from './submission/submission.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    QuestionnaireModule,
    SubmissionModule,
  ],
  providers: [ResponsesValidator],
})
export class AppModule {}
