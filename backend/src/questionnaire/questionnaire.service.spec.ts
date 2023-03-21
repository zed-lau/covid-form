import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  questionnaireRepositoryMockFactory,
  questionRepositoryMockFactory,
} from '../../test/mocks/questionnaire.mock';
import { Question, Questionnaire } from './entity';
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
      ],
    }).compile();

    service = module.get<QuestionnaireService>(QuestionnaireService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
