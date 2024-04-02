import { HttpService } from "@nestjs/axios";
import { GeocodeProxy } from "../interfaces";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { Injectable } from "@nestjs/common";
import { GeocodeResponseDto } from "@tutorify/shared";

interface LocationIQResponse {
    lat: string;
    lon: string;
}

export const LOCATION_IQ = 'LOCATION_IQ';

@Injectable()
export class LocationIQProxy implements GeocodeProxy {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    async geocode(q: string): Promise<GeocodeResponseDto> {
        const params = {
            key: this.configService.get<string>('GEOCODE_LOCATION_IQ_ACCESS_TOKEN'),
            q,
            format: 'json',
            countrycodes: 'vn'
        }

        const { data } = await firstValueFrom(
            this.httpService.get<LocationIQResponse[]>(
                this.configService.get('GEOCODE_LOCATION_IQ_BASE_URL'),
                {
                    params
                },
            )
        );

        console.log(data);

        return {
            lon: data[0].lon,
            lat: data[0].lat,
        }
    }
}