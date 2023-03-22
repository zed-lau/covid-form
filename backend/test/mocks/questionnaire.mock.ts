import { Repository } from 'typeorm';
import { MockType } from '../types';
import { QuestionnaireService } from '../../src/questionnaire/questionnaire.service';
import { Question, Questionnaire, QuestionValidation } from '../../src/questionnaire/entity';

export const questionnaireServiceMockFactory: () => MockType<QuestionnaireService> =
  jest.fn(() => ({
    getQuestionnaire: jest.fn(),
    getQuestions: jest.fn(),
  }));

export const questionnaireRepositoryMockFactory: () => MockType<
  Repository<Questionnaire>
> = jest.fn(() => ({
  createQueryBuilder: jest.fn(),
}));

export const questionRepositoryMockFactory: () => MockType<
  Repository<Question>
> = jest.fn(() => ({
  createQueryBuilder: jest.fn(),
}));

export const questionValidationRepositoryMockFactory: () => MockType<
  Repository<QuestionValidation>
> = jest.fn(() => ({
  createQueryBuilder: jest.fn(),
}));
