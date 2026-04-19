// paquete-interface.ts
export interface TipoPaquete {
  folio: number;
  cliente_id: number;
  nombre_cliente?: string;
  tamano: string; 
  forma: string;
  precio: number;
  peso: number;
}

export interface CrearTipoPaqueteDTO {
  cliente_id: number;
  tamano: string;
  forma: string;
  precio: number | null;
  peso: number | null;
}

export interface ActualizarTipoPaqueteDTO {
  tamano: string;
  forma: string;
  precio: number | null;
  peso: number | null;
  cliente_id: number | null;
}
