export interface Transporte {
  numero_serie: string;
  sucursal_id: number;
  empleado_id: number | null;
  transportista: string;
  tipo_id: number;
  tipo_transporte: string;
  subtipo_id: number;
  subtipo_transporte: string;
  capacidad_carga: number;
  unidad_medida: string;
  placa?: string;
}

export interface CrearTransporteDTO {
  numero_serie: string;
  sucursal_id: number;
  empleado_id?: number | null;
  subtipo_id: number;
  capacidad_carga: number;
  unidad_medida: string;
  placa?: string;
}

export interface ActualizarTransporteDTO {
  empleado_id: number | null;
  capacidad_carga: number | null;
  unidad_medida: string;
  placa?: string;
}
