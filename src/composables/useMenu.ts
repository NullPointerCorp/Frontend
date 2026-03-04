import { computed } from "vue";

type Role = "admin" | "manager" | "empleado";

export function useMenu(role: Role) {
  const menuItems = computed(() => {
    const base = [
      { icon: "mdi-view-dashboard", title: "Dashboard", route: "/dashboard" },
    ];

    if (role === "admin") {
      base.push(
        { icon: "mdi-store", title: "Sucursales", route: "/sucursales" },
        { icon: "mdi-warehouse", title: "Almacenes", route: "/almacenes" },
        { icon: "mdi-badge-account", title: "Empleados", route: "/empleados" },
        { icon: "mdi-truck", title: "Transporte", route: "/transporte" },
        {
          icon: "mdi-account-group",
          title: "Clientes",
          route: "/clientes",
        },
        {
          icon: "mdi-package-variant-closed",
          title: "Paquetes",
          route: "/paquetes",
        },
      );
    }

    if (role === "manager") {
      base.push({
        icon: "mdi-account-group",
        title: "Clientes",
        route: "/clientes",
      });
    }

    return base;
  });

  return { menuItems };
}
