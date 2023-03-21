import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Question } from '../../questionnaire/entity';
import { Submission } from './submission.entity';
import { IQuestionResponse } from '../../types';

@Entity('response')
export class QuestionResponse implements IQuestionResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  // Required for creation
  @Column({ name: 'question_id' })
  questionId: number;

  // Required for creation
  @Column({ name: 'submission_id' })
  submissionId: number;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => Submission)
  @JoinColumn({ name: 'submission_id' })
  submission: Submission;
}
