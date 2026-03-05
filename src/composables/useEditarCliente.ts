import { ref } from "vue";
import type { Cliente } from "@/types/cliente.types";
import { useZodValidation } from "@/composables/useZodValidation";
import { actualizarClienteSchema } from "@/schemas/cliente.schema";
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

export const useEditarCliente = (onSuccess: (cliente: Cliente) => void) => {
  const { validate, validateAll } = useZodValidation(actualizarClienteSchema)

  const dialog = ref(false);
  const loading = ref(false);
  const errorMessage = ref("");
  const clienteSeleccionado = ref<Cliente | null>(null);

  const form = ref({
    cliente_id: 0,
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    telefono: "",
  });

  const abrirModal = (cliente: Cliente) => {
    clienteSeleccionado.value = cliente;
    form.value = {
      cliente_id: cliente.cliente_id,
      nombre: cliente.nombre,
      apellido_paterno: cliente.apellido_paterno,
      apellido_materno: cliente.apellido_materno ?? "",
      correo: cliente.correo,
      telefono: cliente.telefono ?? "",
    };
    dialog.value = true;
  };

  const prepararDatos = () => ({
    nombre: form.value.nombre.trim(),
    apellido_paterno: form.value.apellido_paterno.trim(),
    apellido_materno: form.value.apellido_materno.trim() || null,
    telefono: form.value.telefono.trim() || null,
  });

  const editarCliente = async () => {
    if (!clienteSeleccionado.value) return;

    const { success } = validateAll(form.value)
    if (!success) {
      showToast('Por favor corrige los errores del formulario', 'warning')
      return
    }

    loading.value = true;
    errorMessage.value = "";

    try {
      const token = localStorage.getItem("token");
      const datos = prepararDatos();
      
      const response = await fetch(
        `http://localhost:3000/clientes/${clienteSeleccionado.value.cliente_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        errorMessage.value = data.message || "Error al actualizar cliente";
        return;
      }

      onSuccess(data);
      showToast(`¡Cliente modificado con éxito!`, 'success');
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
    validate,
  };
};