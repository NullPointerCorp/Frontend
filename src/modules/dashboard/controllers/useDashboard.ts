import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/modules/auth/store/auth.store";

export function useDashboard() {
  const router = useRouter();
  const authStore = useAuthStore();

  const allCatalogItems = [
    {
      icon: 'mdi-store',
      title: "Sucursales",
      description: "Gestión de ubicaciones físicas y puntos de distribución.",
      route: "/sucursales",
      roles: [1],
    },
    {
      icon: "mdi-warehouse",
      title: "Almacenes",
      description: "Control de inventario y capacidad de almacenamiento.",
      route: "/almacenes",
      roles: [1],
    },
    {
      icon: "mdi-shield-account",
      title: "Roles",
      description: "Roles y permisos de usuario.",
      route: "/roles",
      roles: [1],
    },
    {
      icon: "mdi-badge-account",
      title: "Empleados",
      description: "Gestión de personal operativo y administrativo.",
      route: "/empleados",
      roles: [1, 2],
    },
    {
      icon: "mdi-truck",
      title: "Transporte",
      description: "Flota vehicular, rutas y mantenimientos preventivos.",
      route: "/transporte",
      roles: [1],
    },
    {
      icon: "mdi-account-group",
      title: "Clientes",
      description: "Directorio de socios comerciales y clientes finales.",
      route: "/clientes",
      roles: [1, 2, 3],
    },
    {
      icon: "mdi-package-variant-closed",
      title: "Tipos de paquetes",
      description: "Tipos de paquetes para los envíos.",
      route: "/tipos-paquete",
      roles: [1],
    },
    {
      icon: "mdi-airplane",
      title: "Listar Envíos",
      description: "Tipos de paquetes para los envíos.",
      route: "/envios",
      roles: [1, 2, 3],
    },
    {
      icon: "mdi-cube-send",
      title: "Registrar Envío",
      description: "Tipos de paquetes para los envíos.",
      route: "/registrar-envio",
      roles: [1, 2, 3],
    },
    {
      icon: "mdi-airplane-off",
      title: "Cancelar Envío",
      description: "Tipos de paquetes para los envíos.",
      route: "/cancelar-envio",
      roles: [1, 2, 3],
    },
  ];

  const catalogItems = computed(() => {
    const rolId = authStore.session?.rol_id;
    if (!rolId) return [];
    return allCatalogItems.filter((item) => item.roles.includes(rolId));
  });

  const navigateTo = (route: string) => {
    router.push(route);
  };

  return {
    catalogItems,
    navigateTo,
  };
}
