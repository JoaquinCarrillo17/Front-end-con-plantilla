import { Huesped } from "../../huespedes/interfaces/huesped.interface";

export enum TipoHabitacion {
  INDIVIDUAL = "iNDIVIDUAL",
  DOBLE = "DOBLE",
  CUADRUPLE = "CUADRUPLE",
  SUITE = "SUITE",
}

export interface Habitacion {
  id?: number;
  numero: number;
  tipoHabitacion: TipoHabitacion;
  precioNoche: number;
  huespedes?: Huesped[];
}
