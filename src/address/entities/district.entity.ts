import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Ward } from './ward.entity';
import { Province } from './province.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'districts' })
export class District {
  @Expose({ name: "id" })
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

  @OneToMany(() => Ward, (ward) => ward.district)
  wards: Ward[];

  @ManyToOne(() => Province, (province) => province.districts)
  province: Province;
}
