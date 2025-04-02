import { number } from "zod";
import { Gender } from "../../enums/Gender";
import { RoleName } from "../../enums/RoleName";
import { StatusEntity } from "../../enums/StatusEntity";
import { LocationDto } from "../location";

export interface JWTAuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDto {
  userNameOrEmailOrPhone: string;
  password: string;
  registrationTokens: string[];
}

export interface SignupDto {
  email: string;
  password: string;
  fullName: string;
  registrationTokens: string[];
}

export interface UserResponse {
  id: number;
  userName: string;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  numOfExchangedItems: number;
  numOfFeedbacks: number;
  numOfRatings: number;
  statusEntity: StatusEntity;
  image: string;
  roleName: RoleName;
  creationDate: Date;
  userLocations: UserLocationDto[];
}

export interface PasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UserLocationDto {
  id: number;
  userId: number;
  specificAddress: string;
  isPrimary: boolean;
  location: LocationDto;
}
