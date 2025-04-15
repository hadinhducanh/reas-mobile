import { Gender } from "../../enums/Gender";

export interface UpdateResidentRequest {
  fullName: string;
  phone: string;
  gender: Gender;
  image: string | null;
  userLocationId: number;
}

export interface UserLocationRequest {
  id: number;
  specificAddress: string;
  latitude: number;
  longitude: number;
  locationId: number;
}
