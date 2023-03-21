import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionnaireService } from '../questionnaire/questionnaire.service';
import { questionnaireServiceMockFactory } from '../../test/mocks/questionnaire.mock';
import { submissionRepositoryMockFactory } from '../../test/mocks/submission.mock';
import { Submission } from './entity';
import { SubmissionService } from './submission.service';
import { MockType } from '../../test/types';

describe('SubmissionService', () => {
  let service: SubmissionService;
  let mockRepository: MockType<Repository<Submission>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmissionService,
        {
          provide: getRepositoryToken(Submission),
          useFactory: submissionRepositoryMockFactory,
        },
        {
          provide: QuestionnaireService,
          useFactory: questionnaireServiceMockFactory,
        },
      ],
    }).compile();

    service = module.get<SubmissionService>(SubmissionService);
    mockRepository = module.get(getRepositoryToken(Submission));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
