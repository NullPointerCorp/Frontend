export interface TipoPaquete {
  tipo_paquete_id: number;
  tamanio: string; 
  forma: string;
  precio: number;
}

export interface CrearTipoPaqueteDTO {
  tamanio: string;
  forma: string;
  precio: number | null;
}

export interface ActualizarTipoPaqueteDTO {
  tamanio: string;
  forma: string;
  precio: number | null;
}
