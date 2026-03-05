import { ref } from "vue";
import { useRouter } from "vue-router";

export function useDashboard() {
  const router = useRouter();

  const catalogItems = ref([
    {
      icon: 'mdi-store',
      title: "Sucursales",
      description: "Gestión de ubicaciones físicas y puntos de distribución.",
      route: "/sucursales",
    },
    {
      icon: "mdi-warehouse",
      title: "Almacenes",
      description: "Control de inventario y capacidad de almacenamiento.",
      route: "/almacenes",
    },
    {
      icon: "mdi-badge-account",
      title: "Empleados",
      description: "Gestión de personal operativo y administrativo.",
      route: "/empleados",
    },
    {
      icon: "mdi-truck",
      title: "Transportes",
      description: "Flota vehicular, rutas y mantenimientos preventivos.",
      route: "/transportes",
    },
    {
      icon: "mdi-account-group",
      title: "Clientes",
      description: "Directorio de socios comerciales y clientes finales.",
      route: "/clientes",
    },
    {
      icon: "mdi-package-variant-closed",
      title: "Paquetes",
      description: "Seguimiento de envíos, estados y logística de última milla.",
      route: "/paquetes",
    },
  ]);

  const user = ref({
    name: "Admin User",
    role: "Logistics Manager"
  });

  const navigateTo = (route: string) => {
    router.push(route);
  };

  return {
    catalogItems,
    user,
    navigateTo,
  };
}