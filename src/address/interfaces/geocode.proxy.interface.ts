import { GeocodeResponseDto } from "@tutorify/shared";

export interface GeocodeProxy {
    geocode(fullAddress: string): Promise<GeocodeResponseDto>;
}