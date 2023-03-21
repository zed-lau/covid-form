import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionnaireService } from '../questionnaire/questionnaire.service';
import { IQuestionResponse, ISubmissionDto } from '../types';
import { Repository } from 'typeorm';
import { QuestionResponse, Submission } from './entity';
import dataSource from '../db/datasource';

@Injectable()
export class SubmissionService {
  constructor(
    private readonly questionnaireService: QuestionnaireService,
    @InjectRepository(Submission)
    private submissionRepo: Repository<Submission>,
  ) {}
  async getSubmissionResponses() {
    const submissions = await this.submissionRepo
      .createQueryBuilder('submission')
      .leftJoin('submission.responses', 'response')
      .select(['submission.id', 'response.questionId', 'response.value'])
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
    const questions = await this.questionnaireService.getQuestions();

    return {
      questions: questions.map(
        ({ type, order, options, ...displayedAttrs }) => displayedAttrs,
      ),
      submissionResponses,
    };
  }
  async create(submissionDto: ISubmissionDto) {
    const responses = submissionDto.responses;
    const providedQuestionIds = Object.keys(responses);
    const questionnaire = await this.questionnaireService.getQuestionnaire(
      submissionDto.questionnaireId,
    );
    const questions = questionnaire.questions;

    const expectedQuestionIds = questions.map((q) => String(q.id));
    if (
      JSON.stringify(expectedQuestionIds) ===
      JSON.stringify(providedQuestionIds)
    ) {
      questions.forEach((question) => {
        if (question.type === 'OneOption') {
          const allowedValues = question.options.map((o) => o.value);
          const providedValue = responses[String(question.id)];
          if (!allowedValues.includes(providedValue)) {
            Logger.error(
              `Invalid value ${providedValue} provided for question ${question.id} in questionnaire ${questionnaire.id}`,
            );
            throw new BadRequestException(
              `Invalid response provided for questionnaire`,
            );
          }
        }
      });
    } else {
      Logger.error(
        `Invalid questions ${JSON.stringify(
          providedQuestionIds,
        )} provided for questionnaire ${questionnaire.id}`,
      );
      throw new BadRequestException(
        `Invalid response provided for questionnaire`,
      );
    }

    await dataSource.initialize();
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
