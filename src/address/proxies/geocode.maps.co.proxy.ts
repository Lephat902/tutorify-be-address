import { HttpService } from "@nestjs/axios";
import { GeocodeProxy } from "../interfaces";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { Injectable } from "@nestjs/common";
import { GeocodeResponseDto } from "@tutorify/shared";

interface IGeoLocationMatchingPlaceResponse {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: string[];
    lat: number;
    lon: number;
    display_name: string;
    class: string;
    type: string;
    importance: string;
}

export const GEOCODE_MAPS_CO = 'GEOCODE_MAPS_CO';

@Injectable()
export class GeocodeMapsCoProxy implements GeocodeProxy {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    async geocode(q: string): Promise<GeocodeResponseDto> {
        const params = {
            q,
            api_key: this.configService.get('GEOCODE_MAPS_CO_API_KEY'),
        }

        const { data } = await firstValueFrom(
            this.httpService.get<IGeoLocationMatchingPlaceResponse[]>(
                this.configService.get('GEOCODE_MAPS_CO_BASE_URL'),
                {
                    params
                },
            )
        );

        return data.length ? { lat: data[0].lat, lon: data[0].lon } : null;
    }
}