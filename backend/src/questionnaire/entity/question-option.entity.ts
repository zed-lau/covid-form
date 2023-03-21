import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Question } from './question.entity';

@Entity('question_option')
export class QuestionOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column()
  order: number;

  @JoinColumn({ name: 'question_id' })
  @ManyToOne(() => Question)
  question: Question;
}
