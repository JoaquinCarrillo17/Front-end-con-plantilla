import { Huesped } from "../../huespedes/interfaces/huesped.interface";

enum TipoHabitacion {
  INDIVIDUAL = "iNDIVIDUAL",
  DOBLE = "DOBLE",
  CUADRUPLE = "CUADRUPLE",
  SUITE = "SUITE",
}

export interface Habitacion {
  id: number;
  numero: string;
  tipoHabitacion: TipoHabitacion;
  precioNoche: number;
}
