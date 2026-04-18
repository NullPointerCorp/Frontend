import { ref } from 'vue'
import { useZodValidation } from '@/composables/useZodValidation'
import { actualizarSucursalSchema } from '@/modules/sucursal/schemas/SucursalSchema'
import { useToast } from '@/composables/useToast'
import type { Sucursal, ActualizarSucursalDTO } from '@/modules/sucursal/interfaces/sucursal-interface'
import sucursalAPI from '../api/sucursalAPI'

interface FormEditarSucursal {
  nombre_sucursal: string;
  colonia: string;
  codigo_postal: string;
  calle: string;
  numero_exterior: string;
  numero_interior: string;
  longitud: number | undefined;
  latitud: number | undefined;
  empleado_id_supervisor: number | null;
}

export const useEditarSucursal = (onSuccess: (sucursal: Sucursal) => void) => {
  const { validate } = useZodValidation(actualizarSucursalSchema)
  const { showToast } = useToast() 

  const dialog = ref(false)
  const loading = ref(false)
  const sucursalSeleccionada = ref<Sucursal | null>(null)

  const form = ref<FormEditarSucursal>({
    nombre_sucursal: '',
    colonia: '',
    codigo_postal: '',
    calle: '',
    numero_exterior: '',
    numero_interior: '',
    longitud: undefined,
    latitud: undefined,
    empleado_id_supervisor: null,
  })

  const abrirModal = (sucursal: Sucursal) => {
    sucursalSeleccionada.value = sucursal
    form.value = {
      nombre_sucursal: sucursal.nombre_sucursal ?? '',
      colonia: sucursal.colonia ?? '',
      codigo_postal: sucursal.codigo_postal ?? '',
      calle: sucursal.calle ?? '',
      numero_exterior: sucursal.numero_exterior ?? '',
      numero_interior: sucursal.numero_interior ?? '',
      longitud: sucursal.longitud ?? undefined,
      latitud: sucursal.latitud ?? undefined,
      empleado_id_supervisor: sucursal.empleado_id_supervisor ?? null,
    }
    dialog.value = true
  }

  const prepararDatos = (): ActualizarSucursalDTO => ({
    nombre_sucursal: form.value.nombre_sucursal.trim(),
    colonia: form.value.colonia.trim(),
    codigo_postal: form.value.codigo_postal.trim(),
    calle: form.value.calle.trim(),
    numero_exterior: form.value.numero_exterior.trim(),
    numero_interior: form.value.numero_interior?.trim() || null,
    longitud: form.value.longitud ?? null,
    latitud: form.value.latitud ?? null,
    empleado_id_supervisor: form.value.empleado_id_supervisor ?? null,
  })

  const editarSucursal = async () => { 
    if (!sucursalSeleccionada.value) return

    loading.value = true
    try {
      const { data } = await sucursalAPI.put<Sucursal>( 
        `/${sucursalSeleccionada.value.sucursal_id}`,
        prepararDatos()
      )

      const sucursalActualizada = {
        ...data,
        nombre_estado: data.nombre_estado ?? sucursalSeleccionada.value.nombre_estado,
        nombre_ciudad: data.nombre_ciudad ?? sucursalSeleccionada.value.nombre_ciudad,
      }

      onSuccess(sucursalActualizada)
      showToast('¡Sucursal modificada con éxito!', 'success')
      dialog.value = false
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al conectar con el servidor', 'error')
    } finally {
      loading.value = false
    }
  }

  return {
    dialog,
    loading,
    form,
    sucursalSeleccionada,
    abrirModal,
    editarSucursal,
    validate,
  }
}
