import { z } from "zod";

const codigoPostalRegex = /^\d{5}$/;

export const sucursalSchema = z.object({
  nombre_sucursal: z
    .string()
    .min(1, "El nombre es requerido")
    .max(80, "Máximo 80 caracteres"),

  ciudad_id: z
    .number({
      required_error: "La ciudad es requerida",
      invalid_type_error: "Selecciona una ciudad",
    })
    .int()
    .positive("Selecciona una ciudad"),

  colonia: z
    .string()
    .min(1, "La colonia es requerida")
    .max(100, "Máximo 100 caracteres"),

  codigo_postal: z
    .string()
    .min(1, "El código postal es requerido")
    .regex(codigoPostalRegex, "Debe tener exactamente 5 dígitos"),

  calle: z
    .string()
    .min(1, "La calle es requerida")
    .max(100, "Máximo 100 caracteres"),

  numero_exterior: z
    .string()
    .min(1, "El número exterior es requerido")
    .max(10, "Máximo 10 caracteres"),

  numero_interior: z
    .string()
    .max(10, "Máximo 10 caracteres")
    .optional()
    .or(z.literal("")),

  longitud: z
    .number()
    .min(-180, "Longitud inválida")
    .max(180, "Longitud inválida")
    .optional()
    .or(z.literal(undefined)),

  latitud: z
    .number()
    .min(-90, "Latitud inválida")
    .max(90, "Latitud inválida")
    .optional()
    .or(z.literal(undefined)),

  empleado_id_supervisor: z
    .number()
    .int()
    .positive()
    .optional()
    .or(z.literal(null)),
});

export const actualizarSucursalSchema = sucursalSchema.omit({ ciudad_id: true });

export type SucursalInput = z.infer<typeof sucursalSchema>;
export type ActualizarSucursalInput = z.infer<typeof actualizarSucursalSchema>;