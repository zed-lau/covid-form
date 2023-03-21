import { Questionnaire } from '../../questionnaire/entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QuestionResponse } from './question-response.entity';

@Entity('submission')
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'created_datetime',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDateTime: Date;

  @OneToMany(() => QuestionResponse, (response) => response.submission)
  responses: QuestionResponse[];

  // Required for creation
  @Column({ name: 'questionnaire_id' })
  questionnaireId: number;

  @ManyToOne(() => Questionnaire)
  @JoinColumn({ name: 'questionnaire_id' })
  questionnaire: Questionnaire;
}
