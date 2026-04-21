import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/modules/auth/store/auth.store";

const allItems = [
  { icon: 'mdi-view-dashboard', title: 'Dashboard', route: '/dashboard', roles: [1, 2, 3] },
  { icon: 'mdi-store', title: 'Sucursales', route: '/sucursales', roles: [1, 2] },
  { icon: 'mdi-warehouse', title: 'Almacenes', route: '/almacenes', roles: [1, 2] },
  { icon: 'mdi-shield-account', title: 'Roles', route: '/roles', roles: [1, 2] },
  { icon: 'mdi-badge-account', title: 'Empleados', route: '/empleados', roles: [1] },
  { icon: 'mdi-truck', title: 'Transporte', route: '/transporte', roles: [1, 2] },
  { icon: 'mdi-account-group', title: 'Clientes', route: '/clientes', roles: [1, 2] },
  { icon: 'mdi-package-variant-closed', title: 'Tipos de paquetes', route: '/tipos-paquete', roles: [1, 2, 3] },
  { icon: 'mdi-airplane', title: 'Listar Envíos', route: '/envios', roles: [1, 2, 3] },
  { icon: 'mdi-airplane', title: 'Registrar Envío', route: '/registrar-envio', roles: [1, 2, 3] },
];

export const useSidebar = () => {
  const router = useRouter();
  const auth = useAuthStore();

  const menuItems = computed(() =>
    allItems.filter(item => item.roles.includes(auth.session?.rol_id ?? 0))
  );

  const navigateTo = (route: string) => router.push(route);

  const isActive = (path: string) =>
    router.currentRoute.value.path.startsWith(path);

  const logout = () => {
    auth.clearSession();
    router.push("/login");
  };

  return { menuItems, navigateTo, isActive, logout, auth };
};
