import { HttpService } from "@nestjs/axios";
import { GeocodeProxy } from "../interfaces";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { Injectable } from "@nestjs/common";
import { GeocodeResponseDto } from "@tutorify/shared";

interface GeocodeXYZResponse {
    latt: number;
    longt: number;
}

export const GEOCODE_XYZ = 'GEOCODE_XYZ';

@Injectable()
export class GeocodeXYZProxy implements GeocodeProxy {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    async geocode(locate: string): Promise<GeocodeResponseDto> {
        const params = {
            auth: this.configService.get<string>('GEOCODE_XYZ_AUTH_CODE'),
            locate,
            region: 'VN',
            json: '1',
        }

        const { data } = await firstValueFrom(
            this.httpService.get<GeocodeXYZResponse>(
                this.configService.get('GEOCODE_XYZ_BASE_URL'),
                {
                    params
                },
            )
        );

        return {
            lon: data.longt,
            lat: data.latt,
        }
    }
}