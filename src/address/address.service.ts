import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { District, Province, Ward } from './entities';
import { ProvinceResponseDto } from './dtos';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IGeoLocationMatchingPlaceResponse } from './interfaces';

@Injectable()
export class AddressService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

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
      .where('district.province_code = :provinceCode', { provinceCode })
      .getMany();
  }

  getAllWards(districtCode: string) {
    return this.dataSource
      .createQueryBuilder(Ward, 'ward')
      .select(['ward.code', 'ward.name'])
      .where('ward.district_code = :districtCode', { districtCode })
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

  async getFullAddressByWardCode(wardCode: string) {
    return this.dataSource
      .createQueryBuilder(Ward, 'ward')
      .innerJoin('ward.district', 'district')
      .innerJoin('district.province', 'province')
      .select(['ward', 'district', 'province'])
      .where('ward.code = :wardCode', { wardCode })
      .getOne();
  }

  async getGeoLocation(address: string, wardCode: string) {
    const fullWard = await this.getFullAddressByWardCode(wardCode);
    const addressQuery = `${fullWard.fullNameEn}, ${fullWard.district.fullNameEn}, ${fullWard.district.province.fullNameEn}, Vietnam`;

    const { data } = await firstValueFrom(
      this.httpService.get<IGeoLocationMatchingPlaceResponse[]>(
        this.configService.get('GEO_CODING_URL'),
        {
          params: {
            q: addressQuery,
            api_key: this.configService.get('GEO_CODING_API_KEY'),
          },
        },
      ),
    );

    return data.length ? { lat: data[0].lat, lon: data[0].lon } : null;
  }
}
