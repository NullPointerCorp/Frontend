export interface CrearEnvio {
  correo: string;
  tipo_paquete_id: number | null;
  forma_paquete: string;
  numero_serie: string;
  descripcion: string;
  fecha_salida: string;
  fecha_llegada: string;
  estado_envio: string;
  peso: number;
  origen_id: number | null; 
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
  numero_serie: string;
  nombre_subtipo: string;
  fecha_salida: string;
  fecha_llegada: string;
  origen: string;          
  destino: string;
  estado_envio: string;
}
