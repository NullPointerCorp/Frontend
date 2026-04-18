export interface Cliente {
  cliente_id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string | null;
  correo: string;
  telefono: string;
}

export interface CrearClienteDTO {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string | null;
  correo: string;
  telefono: string;
}

export interface ActualizarClienteDTO {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string | null;
  telefono: string;
}
