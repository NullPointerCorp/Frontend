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
