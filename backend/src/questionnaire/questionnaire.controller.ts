import { Controller, Get, Param } from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';

@Controller('questionnaire')
export class QuestionnaireController {
  constructor(private readonly service: QuestionnaireService) {}

  @Get(':id')
  getQuestionnaire(@Param('id') id: number) {
    return this.service.getQuestionnaire(id);
  }
}
