import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'lots', orderBy: { id: 'ASC' } })
export class Lot {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  @IsNotEmpty({ message: 'O campo name é obrigatório' })
  @IsString()
  @Expose()
  name: string;

  @Column({ default: true })
  @Expose()
  active: boolean;

  @CreateDateColumn({
    name: 'createdAt',
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
    transformer: {
      from: (value: Date) => new Date(value),
      to: (value: Date) =>
        value instanceof Date ? value.toISOString() : value,
    },
  })
  @Expose()
  createdAt: Date;
}
