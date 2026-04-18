import { z } from "zod";

const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const telefonoRegex = /^\d{10}$/;

export const clienteSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "Mínimo 2 caracteres")
    .max(60, "Máximo 60 caracteres")
    .regex(soloLetras, "Solo se permiten letras y espacios"),

  apellido_paterno: z
    .string()
    .min(1, "El apellido paterno es requerido")
    .min(2, "Mínimo 2 caracteres")
    .max(60, "Máximo 60 caracteres")
    .regex(soloLetras, "Solo se permiten letras y espacios"),

  apellido_materno: z
    .string()
    .max(60, "Máximo 60 caracteres")
    .refine(
      (val) => val === "" || soloLetras.test(val),
      "Solo se permiten letras y espacios"
    )
    .optional()
    .or(z.literal("")),

  correo: z
    .string()
    .min(1, "El correo es requerido")
    .max(150, "Máximo 150 caracteres")
    .email("Formato de correo inválido"),

  telefono: z
    .string()
    .min(1, "El teléfono es requerido")
    .regex(telefonoRegex, "El teléfono debe tener exactamente 10 dígitos"),
});

export const actualizarClienteSchema = clienteSchema.omit({ correo: true });

export type ClienteInput = z.infer<typeof clienteSchema>;
export type ActualizarClienteInput = z.infer<typeof actualizarClienteSchema>;