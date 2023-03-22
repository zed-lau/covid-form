import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  questionnaireRepositoryMockFactory,
  questionRepositoryMockFactory,
  questionValidationRepositoryMockFactory,
} from '../../test/mocks/questionnaire.mock';
import { Question, Questionnaire, QuestionValidation } from './entity';
import { QuestionnaireService } from './questionnaire.service';

describe('QuestionnaireService', () => {
  let service: QuestionnaireService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionnaireService,
        {
          provide: getRepositoryToken(Questionnaire),
          useFactory: questionnaireRepositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Question),
          useFactory: questionRepositoryMockFactory,
        },
        {
          provide: getRepositoryToken(QuestionValidation),
          useFactory: questionValidationRepositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<QuestionnaireService>(QuestionnaireService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
