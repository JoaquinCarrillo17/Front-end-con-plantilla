export interface Usuario {
  id?: number;
  nombre: string;
  username: string;
  email: string;
  password: string;
  fechaNacimiento: Date;
  roles?: string[];
}
