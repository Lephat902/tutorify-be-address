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
} from './dtos';

@Controller()
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

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

  @MessagePattern({ cmd: 'getProvinceByCode' })
  async getProvinceByCode(
    provinceCode: string,
  ): Promise<FullProvinceResponseDto> {
    const provinceEntity =
      await this.addressService.getProvinceByCode(provinceCode);

    return provinceEntity;
  }

  @MessagePattern({ cmd: 'getDistrictByCode' })
  async getDistrictByCode(
    districtCode: string,
  ): Promise<FullDistrictResponseDto> {
    const districtEntity =
      await this.addressService.getDistrictByCode(districtCode);

    return districtEntity;
  }

  @MessagePattern({ cmd: 'getWardByCode' })
  async getWardByCode(wardCode: string): Promise<FullWardResponseDto> {
    const wardEntity = await this.addressService.getWardByCode(wardCode);

    return wardEntity;
  }
}
