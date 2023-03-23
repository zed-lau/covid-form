import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QuestionOption } from './question-option.entity';
import { Questionnaire } from './questionnaire.entity';

@Entity('question')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  order: number;

  @Column()
  type: string;

  @OneToMany(() => QuestionOption, (option) => option.question)
  options: QuestionOption[];

  @Column({ name: 'questionnaire_id' })
  questionnaireId: number;

  @JoinColumn({ name: 'questionnaire_id' })
  @ManyToOne(() => Questionnaire)
  questionnaire: Questionnaire;
}
