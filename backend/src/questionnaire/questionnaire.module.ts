import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Questionnaire,
  Question,
  QuestionOption,
  QuestionValidation,
} from './entity';
import { QuestionnaireController } from './questionnaire.controller';
import { QuestionnaireService } from './questionnaire.service';

@Module({
  controllers: [QuestionnaireController],
  providers: [QuestionnaireService],
  imports: [
    TypeOrmModule.forFeature([
      Questionnaire,
      Question,
      QuestionOption,
      QuestionValidation,
    ]),
  ],
  exports: [QuestionnaireService],
})
export class QuestionnaireModule {}
