import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AddressService } from './address.service';
import {
  DistrictResponseDto,
  FullDistrictResponseDto,
  FullProvinceResponseDto,
  FullWardResponseDto,
  ProvinceResponseDto,
  WardResponseDto,
  GetGeocodeDto,
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

  @MessagePattern({ cmd: 'getProvinceByProvinceCode' })
  async getProvinceByProvinceCode(provinceCode: string) {
    return this.addressService.getProvinceByProvinceCode(provinceCode);
  }

  @MessagePattern({ cmd: 'getFullAddressByDistrictCode' })
  async getFullAddressByDistrictCode(districtCode: string) {
    return this.addressService.getFullAddressByDistrictCode(districtCode);
  }

  @MessagePattern({ cmd: 'getFullAddressByWardCode' })
  async getFullAddressByWardCode(wardCode: string) {
    return this.addressService.getFullAddressByWardCode(wardCode);
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
