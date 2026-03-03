import { z } from "zod";

export const clienteSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  apellido_paterno: z.string().min(1, "El apellido paterno es requerido").max(100),
  apellido_materno: z.string().min(1, "El apellido materno es requerido").max(100),
  correo: z.string().email("Correo inválido"),
  telefono: z.string().min(10, "Mínimo 10 dígitos").max(20),
});

export type ClienteForm = z.infer<typeof clienteSchema>;