import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../modules/auth/store/auth.store";

import Login from "../modules/auth/views/Login.vue";
import MainLayout from "../layouts/MainLayout.vue";

import Dashboard from "../modules/dashboard/views/Dashboard.vue";
import Sucursales from "@/modules/sucursal/views/Sucursales.vue";
import Clientes from "@/modules/cliente/views/Clientes.vue";
import Transportes from "@/modules/transporte/views/Transportes.vue"
import TiposPaquetes from "@/modules/tipo_paquete/views/TiposPaquetes.vue";
import Almacenes from "@/modules/almacen/views/Almacen.vue";
import empleados from "@/modules/empleado/views/Empleados.vue"
import Roles from "@/modules/rol/views/Roles.vue";
import Envios from "@/modules/envio/views/Envios.vue";
import RegistrarEnvio from "@/modules/envio/views/RegistrarEnvio.vue";

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
      { path: "sucursales", component: Sucursales },
      { path: "almacenes", component: Almacenes },
      { path: "roles", component: Roles },
      {path: "empleados", component: empleados},
      { path: "transporte", component: Transportes },
      { path: "clientes", component: Clientes },
      { path: "tipos-paquete", component: TiposPaquetes },
      { path: "envios", component: Envios },
      { path: "registrar-envio", component: RegistrarEnvio },

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
