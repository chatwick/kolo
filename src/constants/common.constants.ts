/* eslint-disable no-unused-vars */
export interface IBaseEntity {
  Id: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export enum COLORS {
  PRIMARY = "#8204FF",
  SECONDARY = "#F5F1F8",
  NEUTRAL_GRAY = "#595959",
}

export enum COMMON_ENTITY_STATUS {
  ENABLED = 1,
  DISABLED = 0,
}
