import { ref } from "vue";
import type { Cliente, ActualizarClienteDTO } from "@/modules/cliente/interfaces/cliente-interface";
import { useZodValidation } from "@/composables/useZodValidation";
import { actualizarClienteSchema } from "@/modules/cliente/schemas/ClienteSchema";
import { useToast } from '@/composables/useToast'
import clienteAPI from "../api/clienteAPI";

interface FormEditarCliente {
  cliente_id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  telefono: string;
}

export const useEditarCliente = (onSuccess: (cliente: Cliente) => void) => {
  const { validate } = useZodValidation(actualizarClienteSchema)
  const { showToast } = useToast()

  const dialog = ref(false);
  const loading = ref(false);
  const clienteSeleccionado = ref<Cliente | null>(null);

  const form = ref<FormEditarCliente>({
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

  const prepararDatos = (): ActualizarClienteDTO => ({
    nombre: form.value.nombre.trim(),
    apellido_paterno: form.value.apellido_paterno.trim(),
    apellido_materno: form.value.apellido_materno.trim() || null,
    telefono: form.value.telefono.trim(),
  });

  const editarCliente = async () => {
    if (!clienteSeleccionado.value) return;

    loading.value = true;
    try {
      const { data } = await clienteAPI.put<Cliente>(
        `/${clienteSeleccionado.value.cliente_id}`,
        prepararDatos()
      );
      onSuccess(data);
      showToast("¡Cliente modificado con éxito!", "success");
      dialog.value = false;
    } catch (error: any) {
      showToast(error.response?.data?.message || "Error al conectar con el servidor", "error");
    } finally {
      loading.value = false;
    }
  };

  return {
    dialog,
    loading,
    form,
    clienteSeleccionado,
    abrirModal,
    editarCliente,
    validate,
  };
};
