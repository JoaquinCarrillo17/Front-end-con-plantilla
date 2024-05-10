import { Permiso } from "./permiso.interface";

export interface Rol {
  id?: number;
  nombre: string;
  descripcion: string;
  permisos: Permiso[];
}
