import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { District, Province, Ward } from './entities';
import { ProvinceResponseDto } from './dtos';

@Injectable()
export class AddressService {
  constructor(private readonly dataSource: DataSource) {}

  getAllProvinces(): Promise<ProvinceResponseDto[]> {
    return this.dataSource
      .createQueryBuilder(Province, 'province')
      .select(['province.code', 'province.name'])
      .getMany();
  }

  getAllDistricts(provinceCode: string) {
    return this.dataSource
      .createQueryBuilder(District, 'district')
      .select(['district.code', 'district.name'])
      .where('district.provinceCode = :provinceCode', { provinceCode })
      .getMany();
  }

  getAllWards(districtCode: string) {
    return this.dataSource
      .createQueryBuilder(Ward, 'ward')
      .select(['ward.code', 'ward.name'])
      .where('ward.districtCode = :districtCode', { districtCode })
      .getMany();
  }

  getProvinceByCode(provinceCode: string) {
    return this.dataSource
      .createQueryBuilder(Province, 'province')
      .where('province.code = :provinceCode', { provinceCode })
      .getOne();
  }

  getDistrictByCode(districtCode: string) {
    return this.dataSource
      .createQueryBuilder(District, 'district')
      .where('district.code = :districtCode', { districtCode })
      .getOne();
  }

  getWardByCode(wardCode: string) {
    return this.dataSource
      .createQueryBuilder(Ward, 'ward')
      .where('ward.code = :wardCode', { wardCode })
      .getOne();
  }
}
