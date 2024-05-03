import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { District } from './district.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'wards' })
export class Ward {
  @Expose({ name: "id" })
  @PrimaryColumn()
  code: string;

  @Column({ unique: true })
  slug: string;

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
