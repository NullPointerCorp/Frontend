import { z } from "zod";

export function useZodValidation<T extends z.ZodObject<any>>(schema: T) {
  type SchemaType = z.infer<T>;

  const validate = (field: keyof SchemaType) => {
    return (value: any): string | true => {
      const fieldSchema = schema.shape[field as string];

      if (!fieldSchema) {
        return true;
      }

      const result = fieldSchema.safeParse(value);

      if (result.success) {
        return true;
      }

      const errorList = result.error.issues ?? (result.error as any).errors ?? [];
      return errorList[0]?.message || "Campo inválido";
    };
  };

  const validateAll = (data: unknown): { success: boolean; errors: Record<string, string> } => {
    const result = schema.safeParse(data);

    if (result.success) {
      return { success: true, errors: {} };
    }

    const errors: Record<string, string> = {};
    const errorList = result.error.issues ?? (result.error as any).errors ?? [];

    errorList.forEach((err: any) => {
      const path = err.path.join(".");
      if (!errors[path]) {
        errors[path] = err.message;
      }
    });

    return { success: false, errors };
  };

  return { validate, validateAll };
}