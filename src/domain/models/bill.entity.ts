import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Lot } from './lot.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'bills', orderBy: { name: 'ASC' } })
export class Bill {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column({ type: 'varchar', nullable: false })
  @IsNotEmpty({ message: 'O campo name é obrigatório' })
  @IsString()
  @Expose()
  nameDrawn: string;

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

  @Column({ type: 'varchar', nullable: false })
  @IsNotEmpty({ message: 'O campo digitable line é obrigatório' })
  @IsString()
  @Expose()
  digitableLine: string;

  @Column({ type: 'float', nullable: false })
  @IsNotEmpty({ message: 'O campo value é obrigatório' })
  @IsNumber()
  @Expose()
  value: number;

  @ManyToOne(() => Lot, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  lot: Lot;
}
