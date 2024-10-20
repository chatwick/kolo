import {
  COMMON_ENTITY_STATUS,
  IBaseEntity,
} from "@/constants/common.constants";
import { ProductTypes } from "@/constants/product.constants";

export interface IProduct extends IBaseEntity {
  Name: string;
  Category: ProductTypes;
  VendorId: string;
  Price: string;
  Quantity: number;
  ImageUrl: string;
  Tags?: string[];
  Status: COMMON_ENTITY_STATUS;
  Details?: string;
}

export interface ICreateProductRequestDTO {
  name: string;
  category: ProductTypes;
  vendorId: string;
  status: COMMON_ENTITY_STATUS;
  price: string;
  quantity: number;
  imageUrl: string;
  tags?: string[];
}
