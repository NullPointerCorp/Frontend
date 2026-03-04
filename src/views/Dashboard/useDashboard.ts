import { ref } from "vue";
import { useRouter } from "vue-router";

export function useDashboard() {
  const router = useRouter();

  const menuItems = ref([
    { icon: "mdi-view-dashboard", title: "Dashboard", route: "/dashboard", active: true },
    { icon: "mdi-account-group", title: "Clientes", route: "/clientes" },
    { icon: "mdi-badge-account", title: "Empleados", route: "/empleados" },
    { icon: "mdi-store", title: "Sucursales", route: "/sucursales" },
    { icon: "mdi-warehouse", title: "Almacenes", route: "/almacenes" },
    { icon: "mdi-truck", title: "Transporte", route: "/transporte" },
    { icon: "mdi-package-variant-closed", title: "Paquetes", route: "/paquetes" },
  ]);

  const catalogItems = ref([
    {
      icon: "mdi-account-tie",
      title: "Clientes",
      description: "Directorio de socios comerciales y clientes finales.",
      route: "/clientes",
    },
    {
      icon: "mdi-card-account-details",
      title: "Empleados",
      description: "Gestión de personal operativo y administrativo.",
      route: "/empleados",
    },
    {
      icon: "mdi-map-marker-radius",
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
      icon: "mdi-truck-fast",
      title: "Transporte",
      description: "Flota vehicular, rutas y mantenimientos preventivos.",
      route: "/transporte",
    },
    {
      icon: "mdi-package-variant",
      title: "Paquetes",
      description: "Seguimiento de envíos, estados y logística de última milla.",
      route: "/paquetes",
    },
    {
      icon: "mdi-cog",
      title: "Configuración Avanzada",
      description: "Acceda a ajustes globales del sistema.",
      route: "/configuracion",
      adminOnly: true,
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
    menuItems,
    catalogItems,
    user,
    navigateTo,
  };
}