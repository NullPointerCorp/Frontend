export interface Rol {
  rol_id: number;
  rol_nombre: string;
  descripcion: string | null;
}

export interface CrearRol {
  rol_nombre: string;
  descripcion: string | null;
}

export type EditarRolDTO = Omit<Rol, "rol_id">;
