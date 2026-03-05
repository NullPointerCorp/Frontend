export interface Transporte {
  transporte_id: number;
  transportista_id?: number;
  numero_serie: string;
  nombre_transportista: string;
  tipo_transporte: string;
  subtipo_transporte: string;
  capacidad_carga: number;
  unidad_medida: string;
  placas?: string;
}

export interface CrearTransporteDTO {
  transportista_id: number | null;
  numero_serie: string;
  tipo_transporte: string;
  subtipo_transporte: string;
  capacidad_carga: number | null;
  unidad_medida: string;
  placas?: string;
}

export interface Transportista {
  empleado_id: number;
  nombre: string;
  apellido_paterno: string;
}