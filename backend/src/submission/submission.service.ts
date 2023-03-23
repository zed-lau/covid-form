import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionnaireService } from '../questionnaire/questionnaire.service';
import { IQuestionResponse, ISubmissionDto } from '../types';
import { QuestionResponse, Submission } from './entity';
import dataSource from '../db/datasource';

@Injectable()
export class SubmissionService {
  constructor(
    private readonly questionnaireService: QuestionnaireService,
    @InjectRepository(Submission)
    private submissionRepo: Repository<Submission>,
  ) {}
  async getSubmissionResponses(questionnaireId: number) {
    const submissions = await this.submissionRepo
      .createQueryBuilder('submission')
      .leftJoin('submission.responses', 'response')
      .select(['submission.id', 'response.questionId', 'response.value'])
      .where('submission.questionnaireId=:id', { id: questionnaireId })
      .getMany();

    const submissionResponses = submissions.reduce<
      { [key: string]: string | number }[]
    >((sAcc, submission) => {
      const responses = submission.responses.reduce(
        (rAcc, resp) => ({ ...rAcc, [resp.questionId]: resp.value }),
        {},
      );
      sAcc.push({ id: submission.id, ...responses });
      return sAcc;
    }, []);
    const questions = await this.questionnaireService.getQuestions(
      questionnaireId,
    );

    return {
      questions: questions.map(
        ({ type, order, options, ...displayedAttrs }) => displayedAttrs,
      ),
      responses: submissionResponses,
    };
  }
  async create(submissionDto: ISubmissionDto) {
    Logger.log('Creating submission...');
    const responses = submissionDto.responses;

    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    return await dataSource.transaction(async (transactionalEntityManager) => {
      const entity = transactionalEntityManager.create(Submission, {
        questionnaireId: submissionDto.questionnaireId,
      });
      const submissionResult = await transactionalEntityManager.insert(
        Submission,
        entity,
      );
      const submissionId = submissionResult.identifiers[0].id;
      const responseEntities = this.createResponseEntities(
        responses,
        submissionId,
      );

      await transactionalEntityManager.insert(
        QuestionResponse,
        responseEntities,
      );

      return {
        id: submissionId,
      };
    });
  }

  private createResponseEntities(
    records: Record<string, string>,
    submissionId: number,
  ) {
    const responses: IQuestionResponse[] = [];
    for (const questionId in records) {
      const value = records[questionId];
      responses.push({
        value,
        questionId: parseInt(questionId),
        submissionId,
      });
    }
    return responses;
  }
}
