
enum CategoriaServicio {
  GIMNASIO = "GIMNASIO",
  BAR = "BAR",
  LAVANDERIA = "LAVANDERIA",
  KARAOKE = "KARAOKE",
  CASINO = "CASINO"
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: CategoriaServicio;
}
