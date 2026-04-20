import { ref, watch } from 'vue'
import { actualizarEmpleadoSchema } from '@/modules/empleado/schemas/EmpleadoSchema'
import type { Empleado, ActualizarEmpleadoDTO } from '@/modules/empleado/interfaces/empleado-interface'
import type { Rol } from '@/modules/rol/interfaces/rol-interface'
import type { SucursalOpcion } from '@/composables/useUbicacion'
import { useToast } from '@/composables/useToast'
import { useUbicacion } from '@/composables/useUbicacion'
import empleadoAPI from '../api/empleadoAPI'
import rolAPI from '@/modules/rol/api/rolAPI'
import sucursalAPI from '@/modules/sucursal/api/sucursalAPI'

interface FormEditarEmpleado {
  nombre: string
  apellido_paterno: string
  apellido_materno: string
  telefono: string
  correo: string
  estado_id: number | null
  ciudad_id: number | null
  colonia: string
  codigo_postal: string
  calle: string
  numero_exterior: string
  numero_interior: string
  rol_id: number | null
  sucursal_id: number | null
}

export const useEditarEmpleado = (onSuccess: (empleado: Empleado) => void) => {
  const { showToast } = useToast()

  const {
    estados,
    ciudades,
    loadingEstados,
    loadingCiudades,
    estadoSeleccionado,
    fetchEstados,
  } = useUbicacion()

  const dialog = ref(false)
  const loading = ref(false)
  const empleadoSeleccionado = ref<Empleado | null>(null)
  const erroresForm = ref<Record<string, string>>({})
  const roles = ref<Rol[]>([])
  const sucursales = ref<SucursalOpcion[]>([])

  const form = ref<FormEditarEmpleado>({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    telefono: '',
    correo: '',
    estado_id: null,
    ciudad_id: null,
    colonia: '',
    codigo_postal: '',
    calle: '',
    numero_exterior: '',
    numero_interior: '',
    rol_id: null,
    sucursal_id: null,
  })

  const resetErrores = () => {
    erroresForm.value = {}
  }

  watch(dialog, (abierto) => {
    if (!abierto) resetErrores()
  })

  const camposTexto = [
    'nombre', 'apellido_paterno', 'apellido_materno', 'telefono',
    'colonia', 'codigo_postal', 'calle', 'numero_exterior', 'numero_interior',
  ] as const

  camposTexto.forEach((campo) => {
    watch(() => form.value[campo], () => {
      delete erroresForm.value[campo]
    })
  })

  const camposSelect = ['ciudad_id', 'rol_id', 'sucursal_id'] as const

  camposSelect.forEach((campo) => {
    watch(() => form.value[campo], () => {
      delete erroresForm.value[campo]
    })
  })

  const fetchCatalogos = async () => {
    const [rolesData, sucursalesData] = await Promise.all([
      rolAPI.get<Rol[]>('/').then(({ data }) => (Array.isArray(data) ? data : [])),
      sucursalAPI.get<SucursalOpcion[]>('/').then(({ data }) => (Array.isArray(data) ? data : [])),
      fetchEstados(),
    ])
    roles.value = rolesData
    sucursales.value = sucursalesData
  }

  const abrirModal = async (empleado: Empleado) => {
    empleadoSeleccionado.value = empleado
    form.value = {
      nombre: empleado.nombre,
      apellido_paterno: empleado.apellido_paterno,
      apellido_materno: empleado.apellido_materno ?? '',
      telefono: empleado.telefono,
      correo: empleado.correo,
      estado_id: empleado.estado_id ?? null,
      ciudad_id: empleado.ciudad_id,
      colonia: empleado.colonia,
      codigo_postal: empleado.codigo_postal,
      calle: empleado.calle,
      numero_exterior: empleado.numero_exterior,
      numero_interior: empleado.numero_interior || '',
      rol_id: empleado.rol_id,
      sucursal_id: empleado.sucursal_id,
    }
    resetErrores()
    await fetchCatalogos()
    estadoSeleccionado.value = empleado.estado_id ?? null
    dialog.value = true
  }

  const cerrarModal = () => {
    dialog.value = false
  }

  const validarFormulario = (): ActualizarEmpleadoDTO | null => {
    const resultado = actualizarEmpleadoSchema.safeParse({
      nombre: form.value.nombre,
      apellido_paterno: form.value.apellido_paterno,
      apellido_materno: form.value.apellido_materno,
      telefono: form.value.telefono,
      ciudad_id: form.value.ciudad_id,
      colonia: form.value.colonia,
      codigo_postal: form.value.codigo_postal,
      calle: form.value.calle,
      numero_exterior: form.value.numero_exterior,
      numero_interior: form.value.numero_interior,
      rol_id: form.value.rol_id,
      sucursal_id: form.value.sucursal_id,
    })

    if (!resultado.success) {
      const campos = resultado.error.flatten().fieldErrors
      const errores: Record<string, string> = {}
      for (const [key, mensajes] of Object.entries(campos)) {
        errores[key] = mensajes?.[0] ?? ''
      }
      erroresForm.value = errores
      return null
    }

    return {
      nombre: resultado.data.nombre,
      apellido_paterno: resultado.data.apellido_paterno,
      apellido_materno: resultado.data.apellido_materno || null,
      telefono: resultado.data.telefono || null,
      correo: form.value.correo,
      ciudad_id: resultado.data.ciudad_id,
      colonia: resultado.data.colonia || null,
      codigo_postal: resultado.data.codigo_postal || null,
      calle: resultado.data.calle || null,
      numero_exterior: resultado.data.numero_exterior || null,
      numero_interior: resultado.data.numero_interior || null,
      rol_id: resultado.data.rol_id,
      sucursal_id: resultado.data.sucursal_id,
    }
  }

  const getMensajeError = (error: unknown): string => {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const respuesta = (error as { response?: { data?: { message?: string } } }).response
      return respuesta?.data?.message ?? 'Error al conectar con el servidor'
    }
    return 'Error al conectar con el servidor'
  }

  const editarEmpleado = async (): Promise<void> => {
    if (!empleadoSeleccionado.value) return

    const datos = validarFormulario()
    if (!datos) {
      showToast('Por favor corrige los errores del formulario', 'warning')
      return
    }

    loading.value = true
    try {
      const { data } = await empleadoAPI.put<Empleado>(
        `/${empleadoSeleccionado.value.empleado_id}`,
        datos
      )
      onSuccess({
        ...empleadoSeleccionado.value,
        ...datos,
        ...data,
        numero_interior: data.numero_interior ?? undefined,
      })
      showToast('¡Empleado modificado con éxito!', 'success')
      cerrarModal()
    } catch (error: unknown) {
      showToast(getMensajeError(error), 'error')
    } finally {
      loading.value = false
    }
  }

  return {
    dialog,
    loading,
    form,
    erroresForm,
    roles,
    sucursales,
    empleadoSeleccionado,
    estados,
    ciudades,
    loadingEstados,
    loadingCiudades,
    estadoSeleccionado,
    abrirModal,
    cerrarModal,
    editarEmpleado,
  }
}
