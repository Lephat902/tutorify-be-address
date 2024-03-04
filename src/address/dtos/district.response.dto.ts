export class DistrictResponseDto {
  readonly code: string;
  readonly name: string;
}

export class FullDistrictResponseDto {
  code: string;
  name: string;
  nameEn: string;
  fullName: string;
  fullNameEn: string;
  codeName: string;
  provinceCode: string;
  administrativeUnitId: number;
}
