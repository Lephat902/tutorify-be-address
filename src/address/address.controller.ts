import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AddressService } from './address.service';
import {
  DistrictResponseDto,
  GetGeocodeDto,
  ProvinceResponseDto,
  WardResponseDto
} from './dtos';

@Controller()
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @MessagePattern({ cmd: 'getAllProvinces' })
  async getAllProvinces(): Promise<ProvinceResponseDto[]> {
    const provinceEntities = await this.addressService.getAllProvinces();

    return provinceEntities;
  }

  @MessagePattern({ cmd: 'getAllDistricts' })
  async getAllDistricts(provinceCode: string): Promise<DistrictResponseDto[]> {
    const districtEntities =
      await this.addressService.getAllDistricts(provinceCode);

    return districtEntities;
  }

  @MessagePattern({ cmd: 'getAllWards' })
  async getAllWards(districtCode: string): Promise<WardResponseDto[]> {
    const wardEntities = await this.addressService.getAllWards(districtCode);

    return wardEntities;
  }

  @MessagePattern({ cmd: 'getProvinceByProvinceId' })
  async getProvinceByProvinceId(provinceCode: string) {
    return this.addressService.getProvinceByProvinceId(provinceCode);
  }

  @MessagePattern({ cmd: 'getFullAddressByDistrictCode' })
  async getFullAddressByDistrictCode(districtCode: string) {
    return this.addressService.getFullAddressByDistrict(districtCode);
  }

  @MessagePattern({ cmd: 'getFullAddressByWardCode' })
  async getFullAddressByWardCode(wardCode: string) {
    return this.addressService.getFullAddressByWard(wardCode);
  }

  @MessagePattern({ cmd: 'getProvinceByProvinceIdByProvinceSlug' })
  async getProvinceByProvinceIdByProvinceSlug(slug: string) {
    return this.addressService.getProvinceByProvinceId(slug, 'slug');
  }

  @MessagePattern({ cmd: 'getFullAddressByDistrictSlug' })
  async getFullAddressByDistrictSlug(slug: string) {
    return this.addressService.getFullAddressByDistrict(slug, 'slug');
  }

  @MessagePattern({ cmd: 'getFullAddressByWardSlug' })
  async getFullAddressByWardSlug(slug: string) {
    return this.addressService.getFullAddressByWard(slug, 'slug');
  }

  @MessagePattern({ cmd: 'getGeocodeFromAddressAndWardId' })
  async getGeocodeFromAddressAndWardId(getGeocodeDto: GetGeocodeDto) {
    return this.addressService.getGeocodeFromAddressAndWardId(
      getGeocodeDto.address,
      getGeocodeDto.wardId,
    );
  }

  @MessagePattern({ cmd: 'getGeocodeFromWardId' })
  async getGeocodeFromWardId(wardId: string) {
    return this.addressService.getGeocodeFromWardId(wardId);
  }

  @MessagePattern({ cmd: 'getGeocodeFromDistrictId' })
  async getGeocodeFromDistrictId(districtId: string) {
    return this.addressService.getGeocodeFromDistrictId(districtId);
  }

  @MessagePattern({ cmd: 'getGeocodeFromProvinceId' })
  async getGeocodeFromProvinceId(provinceId: string) {
    return this.addressService.getGeocodeFromProvinceId(provinceId);
  }
}
