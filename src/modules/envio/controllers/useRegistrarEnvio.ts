import { ref, watch } from "vue";
import type { CrearEnvio } from "../interfaces/envio-interface";
import estadoAPI from "@/api/estadoAPI";
import ciudadAPI from "@/api/ciudadAPI";
import sucursalAPI from "@/modules/sucursal/api/sucursalAPI";
import envioAPI from "../api/envioAPI";
import { useToast } from "@/composables/useToast";

export const useRegistrarEnvio = (onEnvioCreado: (envio: any) => void) => {
  const { showToast } = useToast();
  const loading = ref(false);

  const estados = ref<any[]>([]);
  const ciudadesOrigen = ref<any[]>([]);
  const ciudadesDestino = ref<any[]>([]);
  const sucursalesOrigen = ref<any[]>([]);
  const sucursalesDestino = ref<any[]>([]);

  const loadingEstados = ref(false);
  const loadingCiudadesOrigen = ref(false);
  const loadingCiudadesDestino = ref(false);
  const loadingSucursalesOrigen = ref(false);
  const loadingSucursalesDestino = ref(false);

  const estadoOrigen = ref<number | null>(null);
  const estadoDestino = ref<number | null>(null);

  const form = ref<CrearEnvio>({
    correo: "",
    tipo_paquete_id: null,
    numero_serie: "",
    descripcion: "",
    fecha_salida: "",
    fecha_llegada: "",
    estado_envio: "",
    peso: 0,
    origen_id: null,
    destino_id: null,
    cliente_id: null,
  });
const tiposPaquete = ref<{ tipo_paquete_id: number; nombre: string }[]>([]);
  const erroresForm = ref<Record<string, string>>({});

  const fetchEstados = async () => {
    loadingEstados.value = true;
    try {
      const { data } = await estadoAPI.get("/");
      estados.value = data;
    } finally {
      loadingEstados.value = false;
    }
  };

  watch(estadoOrigen, async (val) => {
    form.value.origen_id = 0;
    ciudadesOrigen.value = [];
    sucursalesOrigen.value = [];
    if (!val) return;
    loadingCiudadesOrigen.value = true;
    try {
      const { data } = await ciudadAPI.get(`/?estado_id=${val}`);
      ciudadesOrigen.value = data;
    } finally {
      loadingCiudadesOrigen.value = false;
    }
  });

  watch(estadoDestino, async (val) => {
    form.value.destino_id = 0;
    ciudadesDestino.value = [];
    sucursalesDestino.value = [];
    if (!val) return;
    loadingCiudadesDestino.value = true;
    try {
      const { data } = await ciudadAPI.get(`/?estado_id=${val}`);
      ciudadesDestino.value = data;
    } finally {
      loadingCiudadesDestino.value = false;
    }
  });

  const onCiudadOrigenChange = async (ciudad_id: number) => {
    form.value.origen_id = 0;
    sucursalesOrigen.value = [];
    if (!ciudad_id) return;
    loadingSucursalesOrigen.value = true;
    try {
      const { data } = await sucursalAPI.get(`/?ciudad_id=${ciudad_id}`);
      sucursalesOrigen.value = data;
    } finally {
      loadingSucursalesOrigen.value = false;
    }
  };

  const onCiudadDestinoChange = async (ciudad_id: number) => {
    form.value.destino_id = 0;
    sucursalesDestino.value = [];
    if (!ciudad_id) return;
    loadingSucursalesDestino.value = true;
    try {
      const { data } = await sucursalAPI.get(`/?ciudad_id=${ciudad_id}`);
      sucursalesDestino.value = data;
    } finally {
      loadingSucursalesDestino.value = false;
    }
  };

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.value.cliente_id) e.cliente_id = "Requerido";
    if (!form.value.correo) e.correo = "Requerido";
    if (!form.value.numero_serie) e.numero_serie = "Requerido";
    if (!form.value.tipo_paquete_id) e.tipo_paquete_id = "Requerido";
    if (!form.value.origen_id) e.origen_id = "Requerido";
    if (!form.value.destino_id) e.destino_id = "Requerido";
    if (!form.value) e.numero_serie = "Requerido";
    erroresForm.value = e;
    return Object.keys(e).length === 0;
  };

  const registrarEnvio = async () => {
    if (!validar()) return;
    loading.value = true;
    try {
      const { data } = await envioAPI.post("/", form.value);
      onEnvioCreado(data);
      showToast("Envío registrado con éxito", "success");
      resetForm();
    } catch {
      showToast("Error al registrar el envío", "error");
    } finally {
      loading.value = false;
    }
  };

  const resetForm = () => {
    form.value = {
      correo: "",
      tipo_paquete_id: 0,
      numero_serie: "",
      descripcion: "",
      fecha_salida: "",
      fecha_llegada: "",
      estado_envio: "",
      peso: 0,
      origen_id: 0,
      destino_id: 0,
      cliente_id: 0,
    };
    estadoOrigen.value = null;
    estadoDestino.value = null;
    erroresForm.value = {};
  };

  return {
    form,
    erroresForm,
    loading,
    estados,
    ciudadesOrigen,
    ciudadesDestino,
    sucursalesOrigen,
    sucursalesDestino,
    loadingEstados,
    loadingCiudadesOrigen,
    loadingCiudadesDestino,
    loadingSucursalesOrigen,
    loadingSucursalesDestino,
    estadoOrigen,
    estadoDestino,
    fetchEstados,
    onCiudadOrigenChange,
    onCiudadDestinoChange,
    registrarEnvio,
    resetForm,
    tiposPaquete
  };
};
