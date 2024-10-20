import {
  COMMON_ENTITY_STATUS,
  IBaseEntity,
} from "@/constants/common.constants";

export interface IInventoryComment {
  email: string;
  comment: string;
}

export interface IInventory extends IBaseEntity {
  ownerId: string;
  status: COMMON_ENTITY_STATUS;
  products: string[];
  rank: { rating: number; count: number; comments: IInventoryComment[] };
  maxQuantity: number;
}

export interface ICreateInventoryRequestDTO {
  ownerId: string;
  status: COMMON_ENTITY_STATUS;
  products: string[];
  rank: { rating: number; count: number; comments: IInventoryComment[] };
  maxQuantity: number;
}
