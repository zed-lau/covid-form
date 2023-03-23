import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
import { Question } from '.';

@Entity('questionnaire')
export class Questionnaire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => Question, (question) => question.questionnaire)
  questions: Question[];
}
