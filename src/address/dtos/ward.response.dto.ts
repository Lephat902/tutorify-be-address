export class WardResponseDto {
  readonly code: string;
  readonly name: string;
}

export class FullWardResponseDto {
  readonly code: string;
  readonly name: string;
  readonly nameEn: string;
  readonly fullName: string;
  readonly fullNameEn: string;
  readonly codeName: string;
  readonly districtCode: string;
  readonly administrativeUnitId: number;
}
