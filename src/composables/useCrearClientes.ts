import { ref } from "vue";
import type { Cliente, CrearClienteDTO } from "@/types/cliente.types";

export const useCrearCliente = (onSuccess: (cliente: Cliente) => void) => {
  const dialog = ref(false);
  const loading = ref(false);
  const errorMessage = ref("");

  const form = ref<CrearClienteDTO>({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    telefono: "",
  });

  const resetForm = () => {
    form.value = {
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      correo: "",
      telefono: "",
    };
    errorMessage.value = "";
  };

  const crearCliente = async () => {
    loading.value = true;
    errorMessage.value = "";
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/clientes/nuevo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form.value),
      });

      const data = await response.json();

      if (!response.ok) {
        errorMessage.value = data.message || "Error al registrar cliente";
        return;
      }

      onSuccess({ id: data.id, ...form.value });
      resetForm();
      dialog.value = false;
      } catch (error) {
      errorMessage.value = "Error al conectar con el servidor";
    } finally {
      loading.value = false;
    }
  };

  return { dialog, loading, errorMessage, form, crearCliente, resetForm };
};
