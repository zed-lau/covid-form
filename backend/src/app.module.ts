import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './db/datasource';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { SubmissionModule } from './submission/submission.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    QuestionnaireModule,
    SubmissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
