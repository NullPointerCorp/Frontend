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
  rol_nombre?: string;
  nombre_sucursal?: string;
}

export interface CrearEmpleadoDTO {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string | null;
  telefono: string | null;
  correo: string;
  contrasena: string;
  rol_id: number | null;
  sucursal_id: number | null;
  ciudad_id: number | null;
  colonia: string | null;
  codigo_postal: string | null;
  calle: string | null;
  numero_exterior: string | null;
  numero_interior: string | null;
}

export interface ActualizarEmpleadoDTO {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string | null;
  telefono: string | null;
  correo: string;
  rol_id: number | null;
  sucursal_id: number | null;
  ciudad_id: number | null;
  colonia: string | null;
  codigo_postal: string | null;
  calle: string | null;
  numero_exterior: string | null;
  numero_interior: string | null;
}
