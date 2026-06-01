export type TipoFiltroViaje = 'salidas' | 'entradas' | 'todos'
export type EstadoViaje = 'programado' | 'en_camino' | 'entregado' | 'regresando' | 'finalizado' | 'cancelado'

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
  fecha_llegada: string
  estado: EstadoViaje
}

export interface CrearViajeDTO {
  numero_serie: string
  sucursal_destino_id: number | null
  fecha_salida: string
  fecha_llegada: string
}

export interface EditarViajeDTO {
  numero_serie: string
  fecha_salida: string
  fecha_llegada: string
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
