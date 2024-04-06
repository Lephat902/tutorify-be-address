import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { District, Province, Ward } from './entities';
import { ProvinceResponseDto } from './dtos';
import { GeocodeProxy } from './interfaces';
import { LOCATION_IQ } from './proxies';
import { GeocodeResponseDto } from '@tutorify/shared';
import { removeLeadingZero } from './helpers';

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
      .select(['province.code', 'province.name', 'province.nameEn', 'province.fullName', 'province.fullNameEn'])
      .getMany();
  }

  getAllDistricts(provinceCode: string) {
    return this.dataSource
      .createQueryBuilder(District, 'district')
      .select(['district.code', 'district.name', 'district.nameEn', 'district.fullName', 'district.fullNameEn'])
      .where('district.province_code = :provinceCode', { provinceCode })
      .getMany();
  }

  getAllWards(districtCode: string) {
    return this.dataSource
      .createQueryBuilder(Ward, 'ward')
      .select(['ward.code', 'ward.name', 'ward.nameEn', 'ward.fullName', 'ward.fullNameEn'])
      .where('ward.district_code = :districtCode', { districtCode })
      .getMany();
  }

  async getProvinceByProvinceCode(provinceCode: string) {
    return this.dataSource
      .createQueryBuilder(Province, 'province')
      .where('province.code = :provinceCode', { provinceCode })
      .getOne();
  }

  async getFullAddressByDistrictCode(districtCode: string) {
    return this.dataSource
      .createQueryBuilder(District, 'district')
      .innerJoin('district.province', 'province')
      .select(['district', 'province'])
      .where('district.code = :districtCode', { districtCode })
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

  async getGeocodeFromAddressAndWardId(address: string, wardCode: string): Promise<GeocodeResponseDto> {
    const fullWard = await this.getFullAddressByWardCode(wardCode);
    const wardName = removeLeadingZero(fullWard.fullNameEn);
    const districtName = removeLeadingZero(fullWard.district.fullNameEn);
    const addressQuery = `${address}, ${wardName}, ${districtName}, ${fullWard.district.province.fullNameEn}, Vietnam`;
    console.log('Address to query: ', addressQuery);

    return this.geocodeProxy.geocode(addressQuery);
  }

  async getGeocodeFromWardId(wardId: string): Promise<GeocodeResponseDto> {
    const fullWard = await this.getFullAddressByWardCode(wardId);
    const wardName = removeLeadingZero(fullWard.fullNameEn);
    const districtName = removeLeadingZero(fullWard.district.fullNameEn);
    const addressQuery = `${wardName}, ${districtName}, ${fullWard.district.province.fullNameEn}, Vietnam`;
    console.log('Address to query: ', addressQuery);

    return this.geocodeProxy.geocode(addressQuery);
  }

  async getGeocodeFromDistrictId(districtId: string): Promise<GeocodeResponseDto> {
    const fullDistrict = await this.getFullAddressByDistrictCode(districtId);
    const districtName = removeLeadingZero(fullDistrict.fullNameEn);
    const addressQuery = `${districtName}, ${fullDistrict.province.fullNameEn}, Vietnam`;
    console.log('Address to query: ', addressQuery);

    return this.geocodeProxy.geocode(addressQuery);
  }

  async getGeocodeFromProvinceId(provinceId: string): Promise<GeocodeResponseDto> {
    const fullProvince = await this.getProvinceByProvinceCode(provinceId);
    const addressQuery = `${fullProvince.fullNameEn}, Vietnam`;
    console.log('Address to query: ', addressQuery);

    return this.geocodeProxy.geocode(addressQuery);
  }
}
