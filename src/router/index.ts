import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.store";

import Login from "../views/Login/Login.vue";
import MainLayout from "../layouts/MainLayout.vue";
import Dashboard from "../views/Dashboard/Dashboard.vue";

import Sucursales from "@/views/Sucursales/Sucursales.vue";
import Clientes from "@/views/Clientes/Clientes.vue";
import Almacenes from "@/views/Almacenes/Almacen.vue"
import Paquetes from "@/views/Paquetes/Paquetes.vue";

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
