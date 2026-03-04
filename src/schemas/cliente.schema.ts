import { z } from "zod";

const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const telefonoRegex = /^[0-9+\s\-()]+$/;

export const clienteSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "Mínimo 2 caracteres")
    .max(50, "Máximo 50 caracteres")
    .regex(soloLetras, "Solo se permiten letras"),

  apellido_paterno: z
    .string()
    .min(1, "El apellido paterno es requerido")
    .regex(soloLetras, "Solo se permiten letras"),

  apellido_materno: z
    .string()
    .regex(soloLetras, "Solo se permiten letras")
    .optional()
    .or(z.literal("")),

  correo: z
    .string()
    .min(1, "El correo es requerido")
    .email("Correo inválido"),

  telefono: z
    .string()
    .min(1, "El teléfono es requerido")
    .min(10, "Mínimo 10 dígitos")
    .regex(telefonoRegex, "Teléfono inválido"),
});

export type ClienteInput = z.infer<typeof clienteSchema>;