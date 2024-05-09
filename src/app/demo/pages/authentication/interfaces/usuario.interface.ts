import { Rol } from "src/app/demo/roles/interfaces/rol.interface";

export interface Usuario {
  id?: number;
  nombre: string;
  username: string;
  email: string;
  password: string;
  fechaNacimiento: Date;
  roles?: Rol[];
}
