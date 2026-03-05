export interface Paquete {
  folio: number
  cliente_id: number
  nombre_cliente?: string
  tamano: string  // ← tamano sin i
  forma: string
  precio: number
  peso: number
}