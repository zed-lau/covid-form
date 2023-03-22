import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Question } from '.';

@Entity('question_validation')
export class QuestionValidation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column({ name: 'question_id' })
  questionId: number;

  @JoinColumn({ name: 'question_id' })
  @OneToOne(() => Question)
  question: Question;
}
