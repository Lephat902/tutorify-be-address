import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { District } from './district.entity';

@Entity({ name: 'wards' })
export class Ward {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @Column()
  nameEn: string;

  @Column()
  fullName: string;

  @Column()
  fullNameEn: string;

  @Column()
  codeName: string;

  @Column()
  administrativeUnitId: number;

  @ManyToOne(() => District, (district) => district.wards)
  district: District;
}
