import { ref } from "vue";
import type { Cliente } from "../../types/cliente.types";

import { useToast } from '@/composables/useToast'
const { showToast } = useToast()

export const useEditarCliente = (onSuccess: (cliente: Cliente) => void) => {
  const dialog = ref(false);
  const loading = ref(false);
  const errorMessage = ref("");
  const clienteSeleccionado = ref<Cliente | null>(null);

  const form = ref({
    id: 0,
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    telefono: "",
  });

  const abrirModal = (cliente: Cliente) => {
    clienteSeleccionado.value = cliente;
    form.value = {
      id: cliente.id,
      nombre: cliente.nombre,
      apellido_paterno: cliente.apellido_paterno,
      apellido_materno: cliente.apellido_materno,
      correo: cliente.correo,
      telefono: cliente.telefono,
    };
    dialog.value = true;
  };

  const editarCliente = async () => {
    if (!clienteSeleccionado.value) return;
    loading.value = true;
    errorMessage.value = "";

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/clientes/${clienteSeleccionado.value.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form.value),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        errorMessage.value = data.message || "Error al actualizar cliente";
        return;
      }

      onSuccess({ ...form.value });
      showToast(`Cliente "${form.value.id} - ${form.value.nombre}" actualizado exitosamente`, 'success');
      dialog.value = false;
    } catch (error) {
      errorMessage.value = "Error al conectar con el servidor";
    } finally {
      loading.value = false;
    }
  };

  return {
    dialog,
    loading,
    errorMessage,
    form,
    clienteSeleccionado,
    abrirModal,
    editarCliente,
  };
};
