import { ref } from "vue";
import type { Sucursal } from "@/types/sucursal.types";
import { useToast } from "@/composables/useToast";

const { showToast } = useToast();

export const useEditarSucursal = (onSuccess: (sucursal: Sucursal) => void) => {
  const dialog = ref(false);
  const loading = ref(false);
  const errorMessage = ref("");
  const sucursalSeleccionada = ref<Sucursal | null>(null);

  const form = ref({
    sucursal_id: 0,
    nombre_sucursal: "",
    ciudad_id: 0,
    empleado_id_supervisor: null as number | null,
    colonia: "",
    codigo_postal: "",
    calle: "",
    numero_exterior: "",
    numero_interior: "",
    longitud: undefined as number | undefined,
    latitud: undefined as number | undefined,
  });

  const abrirModal = (sucursal: Sucursal) => {
    sucursalSeleccionada.value = sucursal;
    form.value = {
      sucursal_id: sucursal.sucursal_id,
      nombre_sucursal: sucursal.nombre_sucursal,
      ciudad_id: sucursal.ciudad_id,
      empleado_id_supervisor: sucursal.empleado_id_supervisor ?? null,
      colonia: sucursal.colonia,
      codigo_postal: sucursal.codigo_postal,
      calle: sucursal.calle,
      numero_exterior: sucursal.numero_exterior,
      numero_interior: sucursal.numero_interior ?? "",
      longitud: sucursal.longitud,
      latitud: sucursal.latitud,
    };
    dialog.value = true;
  };

  const editarSucursal = async () => {
    if (!sucursalSeleccionada.value) return;
    loading.value = true;
    errorMessage.value = "";

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/sucursales/${sucursalSeleccionada.value.sucursal_id}`,
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
        errorMessage.value = data.message || "Error al actualizar sucursal";
        return;
      }

      onSuccess(data);
      showToast(`¡Sucursal modificada con éxito!`, "success");
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
    sucursalSeleccionada,
    abrirModal,
    editarSucursal,
  };
};