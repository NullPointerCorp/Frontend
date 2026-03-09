export interface Empleado {
  empleado_id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  telefono: string;
  correo: string;
  ciudad_id: number | null;
  estado_id?: number | null;
  colonia: string;
  codigo_postal: string;
  calle: string;
  numero_exterior: string;
  numero_interior?: string;
  rol_id: number | null;
  sucursal_id: number | null;
  nombre_estado?: string;
  nombre_ciudad?: string;
  nombre_rol?: string;
  nombre_sucursal?: string;
}

export interface RolOpcion {
  rol_id: number;
  nombre_rol: string;
}