import { Habitacion } from "../../habitaciones/interfaces/habitacion.interface";
import { Servicio } from "../../servicios/interfaces/servicio.interface";

export interface Hotel {
  id?: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  sitioWeb: string;
  servicios: Servicio[];
  habitaciones: Habitacion[];
  numeroHabitaciones?: number,
  numeroHabitacionesDisponibles?: number,
  numeroHabitacionesReservadas?: number
}
