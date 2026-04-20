import { z } from "zod";

const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

export const empleadoSchema = z.object({
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

  correo: z.string().min(1, "El correo es requerido").email("Correo inválido"),

  telefono: z
    .string()
    .min(1, "El teléfono es requerido")
    .min(10, "Mínimo 10 dígitos"),

  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),

  confirm_password: z.string(),

  colonia: z.string().min(1, "La colonia es requerida"),
  codigo_postal: z.string().min(5, "Código postal inválido"),
  calle: z.string().min(1, "La calle es requerida"),
  numero_exterior: z.string().min(1, "El número exterior es requerido"),
  numero_interior: z.string().optional(),
  ciudad_id: z.number({ message: "La ciudad es requerida" }),
  rol_id: z.number({ message: "El rol es requerido" }),
  sucursal_id: z.number({ message: "La sucursal es requerida" }),
});

export const actualizarEmpleadoSchema = empleadoSchema.omit({
  correo: true,
  password: true,
  confirm_password: true,
});

export type EmpleadoInput = z.infer<typeof empleadoSchema>;
export type ActualizarEmpleadoInput = z.infer<typeof actualizarEmpleadoSchema>;
