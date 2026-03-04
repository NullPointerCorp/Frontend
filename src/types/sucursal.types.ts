export interface Sucursal {
  sucursal_id: number
  nombre_sucursal: string
  ciudad_id: number
  nombre_ciudad: string
  colonia: string
  codigo_postal: string
  calle: string
  numero_exterior: string
  numero_interior?: string
  longitud?: number
  latitud?: number
}