export type TipoFiltroViaje = 'salidas' | 'entradas' | 'todos'

export interface Viaje {
  viaje_id: number
  numero_serie: string
  placa: string | null
  transportista: string
  sucursal_origen_id: number
  origen: string
  sucursal_destino_id: number
  destino: string
  fecha_salida: string
  fecha_llegada: string | null
}

export interface CrearViajeDTO {
  numero_serie: string
  sucursal_destino_id: number | null
  fecha_salida: string
  fecha_llegada: string | null
}

export interface ViajeCatalogos {
  origen: {
    sucursal_id: number
    nombre_sucursal: string
  }
  transportes: {
    numero_serie: string
    placa: string | null
    capacidad_carga: number
    unidad_medida: string
  }[]
}
