import { Repository } from 'typeorm';
import { MockType } from '../types';
import { SubmissionService } from '../../src/submission/submission.service';
import { Submission } from '../../src/submission/entity';

export const submissionServiceMockFactory: () => MockType<SubmissionService> =
  jest.fn(() => ({
    create: jest.fn(),
    getSubmissionResponses: jest.fn(),
  }));

export const submissionRepositoryMockFactory: () => MockType<
  Repository<Submission>
> = jest.fn(() => ({
  createQueryBuilder: jest.fn(),
}));
