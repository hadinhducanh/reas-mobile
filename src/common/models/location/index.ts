export interface LocationDto {
  id: number;
  area: string;
  province: string;
  city: string;
  district: string;
  ward: string;
  cluster: string;
}

export interface Suggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface PlaceDetail {
  place_id: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
}
