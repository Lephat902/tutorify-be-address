import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { District } from './district.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'provinces' })
export class Province {
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

  @Column()
  administrativeRegionId: number;

  @OneToMany(() => District, (district) => district.province)
  districts: District[];
}
