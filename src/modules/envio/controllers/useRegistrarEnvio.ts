import { ref, watch } from "vue";
import type { CrearEnvio } from "../interfaces/envio-interface";
import tiposPaquetesAPI from "@/modules/tipo_paquete/api/tipo_paqueteAPI";
import sucursalAPI from "@/modules/sucursal/api/sucursalAPI";
import envioAPI from "../api/envioAPI";
import transporteAPI from "@/modules/transporte/api/transporteAPI";
import clienteAPI from "@/modules/cliente/api/clienteAPI";
import { useToast } from "@/composables/useToast";
import ubicacionAPI from "@/modules/envio/api/ubicacionAPI";

export const useRegistrarEnvio = (onEnvioCreado: (envio: any) => void) => {
  const { showToast } = useToast();
  const loading = ref(false);

  // Cliente
  const correoCliente = ref("");
  const clienteEncontrado = ref<any>(null);
  const loadingCliente = ref(false);
  const errorCliente = ref("");

  // Catálogos
  const tiposPaquete = ref<any[]>([]);
  const tiposTransporte = ref<any[]>([]);
  const todosLosSubtipos = ref<any[]>([]);
  const subtiposFiltrados = ref<any[]>([]);
  const todosLosTransportes = ref<any[]>([]);
  const transportes = ref<any[]>([]);

  // Ubicación
  const estados = ref<any[]>([]);
  const ciudadesDestino = ref<any[]>([]);
  const sucursalesDestino = ref<any[]>([]);
  const estadoDestino = ref<number | null>(null);
  const ciudadDestino = ref<number | null>(null);

  const loadingEstados = ref(false);
  const loadingCiudades = ref(false);
  const loadingSucursales = ref(false);
  const loadingTransportes = ref(false);

  const hoy = () => new Date().toISOString().slice(0, 10);

  const form = ref<CrearEnvio>({
    correo: "",
    tipo_paquete_id: null,
    forma_paquete: "",
    numero_serie: "",
    descripcion: "",
    fecha_salida: hoy(),
    fecha_llegada: "",
    estado_envio: "",
    peso: 0,
    origen_id: null,
    destino_id: null,
    cliente_id: null,
  });

  const erroresForm = ref<Record<string, string>>({});

  watch(() => form.value.tipo_paquete_id, () => { delete erroresForm.value.tipo_paquete_id; });
  watch(() => form.value.destino_id,      () => { delete erroresForm.value.destino_id; });
  watch(() => form.value.numero_serie,    () => { delete erroresForm.value.numero_serie; });
  watch(() => form.value.peso,            () => { delete erroresForm.value.peso; });
  watch(() => form.value.descripcion,     () => { delete erroresForm.value.descripcion; });
  watch(correoCliente,                    () => { delete erroresForm.value.correo; });

  const buscarCliente = async () => {
    if (!correoCliente.value) return;
    loadingCliente.value = true;
    errorCliente.value = "";
    clienteEncontrado.value = null;
    try {
      const { data } = await clienteAPI.get(`/buscar/${correoCliente.value}`);
      clienteEncontrado.value = data;
      form.value.cliente_id = data.cliente_id;
      form.value.correo = correoCliente.value;
    } catch {
      errorCliente.value = "No se encontró ningún cliente con ese correo.";
    } finally {
      loadingCliente.value = false;
    }
  };

  const fetchCatalogos = async () => {
    loadingEstados.value = true;
    loadingTransportes.value = true;
    try {
      const [tiposPaqRes, estadosRes, tiposTranRes, subtiposRes, transportesRes] = await Promise.all([
        tiposPaquetesAPI.get("/"),
        ubicacionAPI.get("/estados"),
        transporteAPI.get("/tipos"),
        transporteAPI.get("/subtipos"),
        transporteAPI.get("/"),
      ]);
      tiposPaquete.value = tiposPaqRes.data;
      estados.value = estadosRes.data;
      tiposTransporte.value = tiposTranRes.data;
      todosLosSubtipos.value = subtiposRes.data;
      todosLosTransportes.value = transportesRes.data;
    } finally {
      loadingEstados.value = false;
      loadingTransportes.value = false;
    }
  };

  // Cascada destino
  watch(estadoDestino, async (val) => {
    ciudadDestino.value = null;
    ciudadesDestino.value = [];
    sucursalesDestino.value = [];
    form.value.destino_id = null;
    if (!val) return;
    loadingCiudades.value = true;
    try {
      const { data } = await ubicacionAPI.get(`/ciudades/${val}`);
      ciudadesDestino.value = data;
    } finally {
      loadingCiudades.value = false;
    }
  });

  watch(ciudadDestino, async (val) => {
    sucursalesDestino.value = [];
    form.value.destino_id = null;
    if (!val) return;
    loadingSucursales.value = true;
    try {
      const { data } = await sucursalAPI.get(`/por-ciudad?ciudad_id=${val}`);
      sucursalesDestino.value = data;
    } finally {
      loadingSucursales.value = false;
    }
  });

  // Cascada transporte (filtrado en cliente)
  const tipoTransporteSeleccionado = ref<number | null>(null);
  const subtipoSeleccionado = ref<number | null>(null);

  watch(tipoTransporteSeleccionado, (val) => {
    subtipoSeleccionado.value = null;
    subtiposFiltrados.value = [];
    transportes.value = [];
    form.value.numero_serie = "";
    if (!val) return;
    subtiposFiltrados.value = todosLosSubtipos.value.filter((s) => s.tipo_id === val);
  });

  watch(subtipoSeleccionado, (val) => {
    transportes.value = [];
    form.value.numero_serie = "";
    if (!val) return;
    transportes.value = todosLosTransportes.value.filter((t) => t.subtipo_id === val);
  });

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.value.cliente_id)      e.correo          = "Busca y selecciona un cliente";
    if (!form.value.tipo_paquete_id) e.tipo_paquete_id = "Requerido";
    if (!form.value.descripcion)     e.descripcion     = "Requerido";
    if (!form.value.destino_id)      e.destino_id      = "Requerido";
    if (!form.value.numero_serie)    e.numero_serie    = "Requerido";
    if (!form.value.peso)            e.peso            = "Requerido";
    erroresForm.value = e;
    return Object.keys(e).length === 0;
  };

  const registrarEnvio = async () => {
    if (!validar()) return;
    loading.value = true;
    try {
      const { data } = await envioAPI.post("/nuevo", form.value);
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
      correo: "", tipo_paquete_id: null, forma_paquete: "", numero_serie: "", descripcion: "",
      fecha_salida: "", fecha_llegada: "", estado_envio: "",
      peso: 0, origen_id: null, destino_id: null, cliente_id: null,
    };
    correoCliente.value = "";
    clienteEncontrado.value = null;
    errorCliente.value = "";
    estadoDestino.value = null;
    ciudadDestino.value = null;
    tipoTransporteSeleccionado.value = null;
    subtipoSeleccionado.value = null;
    erroresForm.value = {};
  };

  return {
    form, erroresForm, loading,
    correoCliente, clienteEncontrado, loadingCliente, errorCliente, buscarCliente,
    tiposPaquete, tiposTransporte, subtiposFiltrados, transportes,
    estados, ciudadesDestino, sucursalesDestino,
    estadoDestino, ciudadDestino,
    tipoTransporteSeleccionado, subtipoSeleccionado,
    loadingEstados, loadingCiudades, loadingSucursales, loadingTransportes,
    fetchCatalogos, registrarEnvio, resetForm,
  };
};
