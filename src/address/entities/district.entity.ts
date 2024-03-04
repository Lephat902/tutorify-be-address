import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'districts' })
export class District {
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
  provinceCode: string;

  @Column()
  administrativeUnitId: number;
}
