import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question, Questionnaire } from './entity';

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectRepository(Questionnaire)
    private questionnaireRepo: Repository<Questionnaire>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
  ) {}

  async getQuestionnaire(id: number) {
    return await this.questionnaireRepo
      .createQueryBuilder('questionnaire')
      .leftJoinAndSelect('questionnaire.questions', 'question')
      .leftJoinAndSelect('question.options', 'option')
      .orderBy({ 'question.order': 'ASC', 'option.order': 'ASC' })
      .where('questionnaire.id=:id', { id })
      .getOneOrFail();
  }
  async getQuestions() {
    return await this.questionRepo
      .createQueryBuilder('question')
      .orderBy({ 'question.order': 'ASC' })
      .getMany();
  }
}
