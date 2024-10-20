import { IBaseEntity } from "@/constants/common.constants";
import { WEB_USER_ROLES } from "@/constants/user.constants";

export interface IUser extends IBaseEntity {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  Role: string;
  Status: number;
  Details: string;
}

export interface ILoginUserRequestDTO {
  email: string;
  password: string;
}

export interface ICreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: WEB_USER_ROLES;
}

export interface ILoginUserResponseDTO {
  token: string;
  user: IUser;
}

export type UpdateUserRequestDTO = Partial<IUser>;
