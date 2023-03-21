import { Test, TestingModule } from '@nestjs/testing';
import { submissionServiceMockFactory } from '../../test/mocks/submission.mock';
import { MockType } from '../../test/types';
import { SubmissionDto } from './dto/submission.dto';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';

describe('SubmissionController', () => {
  let controller: SubmissionController;
  let mockSubmissionService: MockType<SubmissionService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmissionController],
      providers: [
        {
          provide: SubmissionService,
          useFactory: submissionServiceMockFactory,
        },
      ],
    }).compile();

    controller = module.get<SubmissionController>(SubmissionController);
    mockSubmissionService = module.get(SubmissionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call SubmissionService to create submission responses', async () => {
    // Given
    const mockSubmission: SubmissionDto = {
      questionnaireId: 0,
      responses: {
        '1': 'mock-response-value',
      },
    };
    jest.spyOn(mockSubmissionService, 'create').mockImplementation(() => {
      return mockSubmission;
    });

    const mockSubmissionResult = { id: 'mock-submission-id' };
    mockSubmissionService.create.mockReturnValue(mockSubmissionResult);

    // When
    const result = await controller.create(mockSubmission);

    // Then
    expect(result).toStrictEqual(mockSubmissionResult);
  });
});
