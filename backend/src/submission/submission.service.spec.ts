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
  let mockQuestionnaireService: MockType<QuestionnaireService>;

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
    mockQuestionnaireService = module.get(QuestionnaireService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get submission responses', async () => {
    // Given
    const mockResponses = [
      {
        id: 1,
        submissionId: 1,
        questionId: 1,
        value: 'mock-response',
      },
      {
        id: 2,
        submissionId: 1,
        questionId: 2,
        value: 'mock-response-2',
      },
    ];
    const mockSubmissions = [
      {
        id: 1,
        createdDateTime: new Date(),
        questionnaireId: 1,
        responses: mockResponses,
      },
    ];
    const mockCreateQueryBuilder = {
      leftJoin: jest.fn().mockImplementation(() => {
        return mockCreateQueryBuilder;
      }),
      select: jest.fn().mockImplementation(() => {
        return mockCreateQueryBuilder;
      }),
      getMany: jest.fn().mockImplementation(() => {
        return mockSubmissions;
      }),
    };

    jest.spyOn(mockRepository, 'createQueryBuilder').mockImplementation(() => {
      return mockCreateQueryBuilder;
    });

    const mockQuestions = [
      {
        id: 1,
        text: 'mock-question',
        order: 1,
        type: 'OneOption',
      },
    ];
    jest
      .spyOn(mockQuestionnaireService, 'getQuestions')
      .mockImplementation(() => {
        return mockQuestions;
      });

    // When
    const submissions = await service.getSubmissionResponses();

    // Then
    expect(submissions).toEqual({
      questions: [
        {
          id: 1,
          text: 'mock-question',
        },
      ],
      responses: [
        {
          1: 'mock-response',
          2: 'mock-response-2',
          id: 1,
        },
      ],
    });
    expect(mockCreateQueryBuilder.leftJoin).toHaveBeenCalledWith(
      'submission.responses',
      'response',
    );
    expect(mockCreateQueryBuilder.select).toHaveBeenCalledWith([
      'submission.id',
      'response.questionId',
      'response.value',
    ]);
    expect(mockCreateQueryBuilder.getMany).toBeCalledTimes(1);
  });
});
