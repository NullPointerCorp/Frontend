export type EstadoEnvio = 'en_espera' | 'registrado' | 'en_camino' | 'entregado' | 'cancelado'

export const estadoEnvioConfig: Record<EstadoEnvio, { color: string; label: string }> = {
  en_espera:  { color: 'warning',  label: 'En Espera'  },
  registrado: { color: 'primary',  label: 'Registrado' },
  en_camino:  { color: 'primary',  label: 'En Camino'  },
  entregado:  { color: 'primary',  label: 'Entregado'  },
  cancelado:  { color: 'error',    label: 'Cancelado'  },
}

export interface CrearEnvio {
  correo: string;
  tipo_paquete_id: number | null;
  forma_paquete: string;
  numero_serie?: string;
  descripcion: string;
  estado_envio: string;
  peso: number;
  destino_id: number | null;
  cliente_id: number | null;
}

export interface EnvioConsultaDTO {
  envio_id: number;
  correo: string;
  descripcion: string;
  tamanio: string;
  forma: string;
  precio: number;
  peso: number;
  nombre_empleado: string; 
  numero_serie: string | null;
  nombre_subtipo: string | null;
  fecha_salida: string | null;
  fecha_llegada: string | null;
  origen: string;          
  destino: string;
  estado_envio: string;
}
