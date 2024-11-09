import { Huesped } from "../../huespedes/interfaces/huesped.interface";

export enum TipoHabitacion {
  INDIVIDUAL = "INDIVIDUAL",
  DOBLE = "DOBLE",
  TRIPLE = "TRIPLE",
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
