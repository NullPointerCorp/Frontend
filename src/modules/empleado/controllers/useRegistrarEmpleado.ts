import { reactive, ref, watch } from 'vue'
import { empleadoSchema } from '@/modules/empleado/schemas/EmpleadoSchema'
import type { Empleado, CrearEmpleadoDTO } from '@/modules/empleado/interfaces/empleado-interface'
import type { Rol } from '@/modules/rol/interfaces/rol-interface'
import type { SucursalOpcion } from '@/composables/useUbicacion'
import { useToast } from '@/composables/useToast'
import { useUbicacion } from '@/composables/useUbicacion'
import empleadoAPI from '../api/empleadoAPI'
import rolAPI from '@/modules/rol/api/rolAPI'
import sucursalAPI from '@/modules/sucursal/api/sucursalAPI'

interface FormRegistrarEmpleado {
  nombre: string
  apellido_paterno: string
  apellido_materno: string
  telefono: string
  correo: string
  password: string
  confirm_password: string
  ciudad_id: number | null
  colonia: string
  codigo_postal: string
  calle: string
  numero_exterior: string
  numero_interior: string
  rol_id: number | null
  sucursal_id: number | null
}

const formInicial = (): FormRegistrarEmpleado => ({
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  telefono: '',
  correo: '',
  password: '',
  confirm_password: '',
  ciudad_id: null,
  colonia: '',
  codigo_postal: '',
  calle: '',
  numero_exterior: '',
  numero_interior: '',
  rol_id: null,
  sucursal_id: null,
})

export const useRegistrarEmpleado = (onSuccess: (empleado: Empleado) => void) => {
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
  const erroresForm = ref<Record<string, string>>({})
  const roles = ref<Rol[]>([])
  const sucursales = ref<SucursalOpcion[]>([])

  const form = reactive<FormRegistrarEmpleado>(formInicial())

  const resetForm = () => Object.assign(form, formInicial())

  const resetErrores = () => {
    erroresForm.value = {}
  }

  const resetUbicacion = () => {
    estadoSeleccionado.value = null
  }

  // Limpia ciudad al cambiar de estado
  watch(estadoSeleccionado, (_, anterior) => {
    if (anterior !== null) form.ciudad_id = null
  })

  // Limpia errores por campo al editar
  const camposTexto = [
    'nombre', 'apellido_paterno', 'apellido_materno', 'telefono', 'correo',
    'password', 'confirm_password', 'colonia', 'codigo_postal', 'calle',
    'numero_exterior', 'numero_interior',
  ] as const

  camposTexto.forEach((campo) => {
    watch(() => form[campo], () => {
      delete erroresForm.value[campo]
    })
  })

  const camposSelect = ['ciudad_id', 'rol_id', 'sucursal_id'] as const

  camposSelect.forEach((campo) => {
    watch(() => form[campo], () => {
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

  const abrirModal = async () => {
    resetForm()
    resetErrores()
    resetUbicacion()
    dialog.value = true
    await fetchCatalogos()
  }

  const cerrarModal = () => {
    dialog.value = false
    setTimeout(() => {
      resetForm()
      resetErrores()
      resetUbicacion()
    }, 300)
  }

  const validarFormulario = (): CrearEmpleadoDTO | null => {
    // Validación de contraseñas antes de Zod
    if (form.password !== form.confirm_password) {
      erroresForm.value = { confirm_password: 'Las contraseñas no coinciden' }
      return null
    }

    const resultado = empleadoSchema.safeParse(form)

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
      telefono: resultado.data.telefono,
      correo: resultado.data.correo.toLowerCase(),
      contrasena: resultado.data.password,
      ciudad_id: resultado.data.ciudad_id,
      colonia: resultado.data.colonia,
      codigo_postal: resultado.data.codigo_postal,
      calle: resultado.data.calle,
      numero_exterior: resultado.data.numero_exterior,
      numero_interior: resultado.data.numero_interior || null,
      rol_id: resultado.data.rol_id,
      sucursal_id: resultado.data.sucursal_id,
    }
  }

  const getMensajeError = (error: unknown): string => {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const respuesta = (error as { response?: { data?: { message?: string } } }).response
      return respuesta?.data?.message ?? 'Error al registrar empleado'
    }
    return 'Error al registrar empleado'
  }

  const registrarEmpleado = async (): Promise<void> => {
    const datos = validarFormulario()
    if (!datos) {
      showToast('Por favor corrige los errores del formulario', 'warning')
      return
    }

    loading.value = true
    try {
      const { data } = await empleadoAPI.post<Empleado>('/', datos)
      onSuccess(data)
      showToast('¡Empleado registrado con éxito!', 'success')
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
    estados,
    ciudades,
    loadingEstados,
    loadingCiudades,
    estadoSeleccionado,
    abrirModal,
    cerrarModal,
    registrarEmpleado,
  }
}
