import { reactive } from "vue";
import type { Transporte, Transportista } from "@/types/transporte.types";

export const TIPOS_TRANSPORTE = ["Terrestre", "Aéreo", "Marítimo"];

export const SUBTIPOS_POR_TIPO: Record<string, string[]> = {
  Terrestre: ["Carro", "Moto", "Trailer", "Camión"],
  Aéreo: ["Avión", "Helicóptero"],
  Marítimo: ["Barco", "Lancha"],
};

export const UNIDADES_MEDIDA = ["Kilogramos", "Toneladas"];

export const useRegistrarTransporte = () => {
  const form = reactive({
    numero_serie: "",
    tipo_transporte: "",
    transportista_id: null as number | null,
    subtipo_transporte: "",
    capacidad_carga: null as number | null,
    unidad_medida: "",
    placas: "",
  });

  const resetForm = () => {
    form.numero_serie = "";
    form.tipo_transporte = "";
    form.transportista_id = null;
    form.subtipo_transporte = "";
    form.capacidad_carga = null;
    form.unidad_medida = "";
    form.placas = "";
  };

  const fetchTransportistas = async (): Promise<Transportista[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/empleados/transportistas", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  };

  const registrarTransporte = async (): Promise<Transporte> => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/transportes/nuevo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al registrar transporte");
    return data;
  };

  return {
    form,
    resetForm,
    fetchTransportistas,
    registrarTransporte,
  };
};
