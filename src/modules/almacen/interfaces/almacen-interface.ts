export interface Almacen {
  almacen_id: number;
  sucursal_id: number;
  nombre_sucursal: string;
  nombre_almacen: string;
  descripcion?: string;
}

export type CrearAlmacenDTO = Omit<Almacen, 'almacen_id' | 'nombre_sucursal'>

export type ActualizarAlmacenDTO = Omit<Almacen, 'almacen_id' | 'nombre_sucursal' | 'sucursal_id'>
