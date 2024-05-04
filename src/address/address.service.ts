import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { District, Province, Ward } from './entities';
import { ProvinceResponseDto } from './dtos';
import { GeocodeProxy } from './interfaces';
import { LOCATION_IQ } from './proxies';
import { GeocodeResponseDto } from '@tutorify/shared';
import { removeLeadingZero } from './helpers';

type FindOneOption = 'code' | 'slug';

@Injectable()
export class AddressService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(LOCATION_IQ)
    private readonly geocodeProxy: GeocodeProxy,
  ) { }

  getAllProvinces(): Promise<ProvinceResponseDto[]> {
    return this.dataSource
      .createQueryBuilder(Province, 'province')
      .select(['province.code', 'province.name', 'province.nameEn', 'province.fullName', 'province.fullNameEn', 'province.slug'])
      .getMany();
  }

  getAllDistricts(provinceCode: string) {
    return this.dataSource
      .createQueryBuilder(District, 'district')
      .select(['district.code', 'district.name', 'district.nameEn', 'district.fullName', 'district.fullNameEn', 'district.slug'])
      .where('district.province_code = :provinceCode', { provinceCode })
      .getMany();
  }

  getAllWards(districtCode: string) {
    return this.dataSource
      .createQueryBuilder(Ward, 'ward')
      .select(['ward.code', 'ward.name', 'ward.nameEn', 'ward.fullName', 'ward.fullNameEn', 'ward.slug'])
      .where('ward.district_code = :districtCode', { districtCode })
      .getMany();
  }

  async getProvinceByProvinceId(value: string, findOneOption: FindOneOption = "code") {
    return this.dataSource
      .createQueryBuilder(Province, 'province')
      .where(`province.${findOneOption} = :value`, { value })
      .getOne();
  }

  async getFullAddressByDistrict(value: string, findOneOption: FindOneOption = "code") {
    return this.dataSource
      .createQueryBuilder(District, 'district')
      .innerJoin('district.province', 'province')
      .select(['district', 'province'])
      .where(`district.${findOneOption} = :value`, { value })
      .getOne();
  }

  async getFullAddressByWard(value: string, findOneOption: FindOneOption = "code") {
    return this.dataSource
      .createQueryBuilder(Ward, 'ward')
      .innerJoin('ward.district', 'district')
      .innerJoin('district.province', 'province')
      .select(['ward', 'district', 'province'])
      .where(`ward.${findOneOption} = :value`, { value })
      .getOne();
  }

  async getGeocodeFromAddressAndWardId(address: string, wardCode: string): Promise<GeocodeResponseDto> {
    const fullWard = await this.getFullAddressByWard(wardCode);
    const wardName = removeLeadingZero(fullWard.fullNameEn);
    const districtName = removeLeadingZero(fullWard.district.fullNameEn);
    const addressQuery = `${address}, ${wardName}, ${districtName}, ${fullWard.district.province.fullNameEn}, Vietnam`;
    console.log('Address to query: ', addressQuery);

    return this.geocodeProxy.geocode(addressQuery);
  }

  async getGeocodeFromWard(value: string, findOneOption: FindOneOption): Promise<GeocodeResponseDto> {
    const fullWard = await this.getFullAddressByWard(value, findOneOption);
    const wardName = removeLeadingZero(fullWard.fullNameEn);
    const districtName = removeLeadingZero(fullWard.district.fullNameEn);
    const addressQuery = `${wardName}, ${districtName}, ${fullWard.district.province.fullNameEn}, Vietnam`;
    console.log('Address to query: ', addressQuery);

    return this.geocodeProxy.geocode(addressQuery);
  }

  async getGeocodeFromDistrict(districtId: string, findOneOption: FindOneOption): Promise<GeocodeResponseDto> {
    const fullDistrict = await this.getFullAddressByDistrict(districtId, findOneOption);
    const districtName = removeLeadingZero(fullDistrict.fullNameEn);
    const addressQuery = `${districtName}, ${fullDistrict.province.fullNameEn}, Vietnam`;
    console.log('Address to query: ', addressQuery);

    return this.geocodeProxy.geocode(addressQuery);
  }

  async getGeocodeFromProvince(provinceId: string, findOneOption: FindOneOption): Promise<GeocodeResponseDto> {
    const fullProvince = await this.getProvinceByProvinceId(provinceId, findOneOption);
    const addressQuery = `${fullProvince.fullNameEn}, Vietnam`;
    console.log('Address to query: ', addressQuery);

    return this.geocodeProxy.geocode(addressQuery);
  }
}
