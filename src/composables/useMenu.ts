import { computed } from "vue";

const allItems = [
  { icon: 'mdi-view-dashboard', title: 'Dashboard', route: '/dashboard', roles: [1, 2, 3] },
  { icon: 'mdi-store', title: 'Sucursales', route: '/sucursales', roles: [1, 2] },
  { icon: 'mdi-warehouse', title: 'Almacenes', route: '/almacenes', roles: [1, 2] },
  { icon: 'mdi-badge-account', title: 'Empleados', route: '/empleados', roles: [1] },
  { icon: 'mdi-truck', title: 'Transportes', route: '/transportes', roles: [1, 2] },
  { icon: 'mdi-account-group', title: 'Clientes', route: '/clientes', roles: [1, 2] },
  { icon: 'mdi-package-variant-closed', title: 'Paquetes', route: '/paquetes', roles: [1, 2, 3] },
]

export const useMenu = (rolId: number) => {
  const menuItems = computed(() =>
    allItems.filter(item => item.roles.includes(rolId))
  )

  return { menuItems }
}
