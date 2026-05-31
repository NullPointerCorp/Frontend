export interface Sucursal {
  sucursal_id: number;
  nombre_sucursal: string;
  ciudad_id: number;
  nombre_ciudad: string;
  nombre_estado?: string;
  nombre_supervisor?: string | null;
  empleado_id_supervisor?: number | null;
  nombre_empleado?: string;
  colonia: string;
  codigo_postal: string;
  calle: string;
  numero_exterior: string;
  numero_interior?: string;
  longitud?: number;
  latitud?: number;
}

export interface CrearSucursalDTO {
  nombre_sucursal: string;
  ciudad_id: number | null;
  colonia: string;
  codigo_postal: string;
  calle: string;
  numero_exterior: string;
  numero_interior: string | null;
  longitud: number | null;
  latitud: number | null;
  empleado_id_supervisor: number | null;
}

export interface ActualizarSucursalDTO {
  nombre_sucursal: string;
  colonia: string;
  codigo_postal: string;
  calle: string;
  numero_exterior: string;
  numero_interior: string | null;
  longitud: number | null;
  latitud: number | null;
  empleado_id_supervisor: number | null;
}
