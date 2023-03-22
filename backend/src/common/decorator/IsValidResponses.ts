import { Injectable, Logger } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isDecimal,
} from 'class-validator';
import { QuestionnaireService } from '../../questionnaire/questionnaire.service';

@ValidatorConstraint({ name: 'responses' })
@Injectable()
export class ResponsesValidator implements ValidatorConstraintInterface {
  private errorMessage: string;
  constructor(private readonly questionnaireService: QuestionnaireService) {
    this.errorMessage = 'Invalid response found';
  }

  async validate(
    responses: Record<string, string>,
    args: ValidationArguments,
  ): Promise<boolean> {
    const [questionnaireIdField] = args.constraints;
    const questionnaireId = (args.object as any)[questionnaireIdField];
    const questionnaire = await this.questionnaireService.getQuestionnaire(
      questionnaireId,
    );
    const questions = questionnaire.questions;
    const providedQuestionIds = Object.keys(responses);
    const expectedQuestionIds = questions.map((q) => String(q.id));

    const questionValidations =
      await this.questionnaireService.getQuestionValidations(questionnaireId);

    if (
      this.areValuesEmpty(responses, questions) ||
      this.areValuesInvalid(questionValidations, responses, questions) ||
      this.areQuestionsInvalid(expectedQuestionIds, providedQuestionIds) ||
      this.areOptionsInvalid(questions, responses, questionnaireId)
    ) {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return this.errorMessage;
  }

  areQuestionsInvalid(expectedQuestionIds, providedQuestionIds) {
    if (
      JSON.stringify(expectedQuestionIds) !==
      JSON.stringify(providedQuestionIds)
    ) {
      this.errorMessage = `Please respond to valid questions`;
      return true;
    }
    return false;
  }

  areOptionsInvalid(questions, responses, questionnaireId) {
    for (const question of questions) {
      if (question.type === 'OneOption') {
        const allowedValues = question.options.map((o) => o.value);
        const providedValue = responses[String(question.id)];
        if (!allowedValues.includes(providedValue)) {
          this.errorMessage = `Invalid value ${providedValue} provided for question ${question.id} in questionnaire ${questionnaireId}`;
          Logger.error(this.errorMessage);
          return true;
        }
      }
    }
    return false;
  }

  areValuesEmpty(responses, questions) {
    const questionIds = Object.keys(responses);
    if (!questionIds || questionIds.length === 0) {
      this.errorMessage = `All fields are empty`;
      Logger.error(this.errorMessage);
      return true;
    }
    for (const question of questions) {
      const questionId = question.id;
      const value = responses[questionId];
      if (!value || value.length === 0) {
        this.errorMessage = `Field '${question.text.toLowerCase()}' is empty`;
        Logger.error(this.errorMessage);
        return true;
      }
    }
    return false;
  }

  areValuesInvalid(questionnaireValidations, responses, questions) {
    for (const validation of questionnaireValidations) {
      const question = questions.find((q) => q.id === validation.questionId);
      const field = question.text.toLowerCase();
      if (validation.type === 'HumanTemperature') {
        const value = responses[String(validation.questionId)];
        if (isDecimal(value)) {
          const temperature = parseFloat(value);
          if (temperature <= 35 || temperature >= 41) {
            this.errorMessage = `Field '${field}' is an invalid human temperature`;
            return true;
          }
        } else {
          this.errorMessage = `Field '${field}' is not a decimal`;
          return true;
        }
      }
    }
    return false;
  }
}

export function IsValidResponses(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isValidResponses',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: ResponsesValidator,
    });
  };
}
