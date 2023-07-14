import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'pdf-orders', orderBy: { id: 'ASC' } })
export class PDFOrder {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string;

  @Column({ type: 'varchar', nullable: false })
  @IsNotEmpty({ message: 'O campo name é obrigatório' })
  @IsString()
  @Expose()
  name: string;
}
