import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../modules/auth/store/auth.store";

import Login from "../modules/auth/views/Login.vue";
import MainLayout from "../layouts/MainLayout.vue";
import Dashboard from "../modules/dashboard/views/Dashboard.vue";

import Sucursales from "@/modules/sucursal/views/Sucursales.vue";
import Clientes from "@/modules/cliente/views/Clientes.vue";
import Transportes from "@/modules/transporte/views/Transportes.vue"
import Paquetes from "@/modules/paquete/views/Paquetes.vue";
import Almacenes from "@/modules/almacen/views/Almacen.vue";
import empleados from "@/modules/empleado/views/Empleados.vue"

const routes = [
  { path: "/", redirect: "/login" },

  {
    path: "/login",
    component: Login,
    meta: { public: true }
  },
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "dashboard", component: Dashboard },
      { path: "clientes", component: Clientes },
      { path: "sucursales", component: Sucursales },
      { path: "almacenes", component: Almacenes },
      { path: "paquetes", component: Paquetes },
      { path: "transporte", component: Transportes },
      {path: "empleados", component: empleados}
    ]
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (!to.meta.public && !authStore.session) {
    return "/login";
  }
});

export default router;
