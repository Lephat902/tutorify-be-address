import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'provinces' })
export class Province {
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

  @Column()
  administrativeRegionId: number;
}
