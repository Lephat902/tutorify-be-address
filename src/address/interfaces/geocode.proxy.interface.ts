import { GeocodeResponse } from "./geocode-response.interface";

export interface GeocodeProxy {
    geocode(fullAddress: string): Promise<GeocodeResponse>;
}