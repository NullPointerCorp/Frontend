import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.store";

import Login from "../views/Login/Login.vue";
import Clientes from "../views/Clientes/Clientes.vue";
import Home from "../views/Home.vue";

const routes = [
  { path: "/login", component: Login },
  { path: "/dashboard", component: Home },
  { path: "/clientes", component: Clientes},
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