export interface Sucursal {
  nombre_estado?: string
  nombre_supervisor?: string | null
  sucursal_id: number
  nombre_sucursal: string
  ciudad_id: number
  nombre_ciudad: string
  empleado_id_supervisor?: number 
  nombre_empleado?: string
  colonia: string
  codigo_postal: string
  calle: string
  numero_exterior: string
  numero_interior?: string
  longitud?: number
  latitud?: number
}