import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Question } from '.';

@Entity('questionnaire')
export class Questionnaire {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Question, (questionnaire) => questionnaire.question)
  questions: Question[];
}
