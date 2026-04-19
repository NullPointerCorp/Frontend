import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface Session {
  id: number;
  nombre: string;
  rol: string;
  rol_id: number;
}

export const useAuthStore = defineStore("auth", () => {
  const session = ref<Session | null>(
    JSON.parse(localStorage.getItem("session") || "null"),
  );

  const isAuthenticated = computed(() => !!session.value);
  const role = computed<string>(() => {
    if (!session.value) {
      throw new Error("No session available");
    }
    return session.value.rol;
  });

  const setSession = (data: Session) => {
    session.value = data;
    localStorage.setItem("session", JSON.stringify(data));
  };

  const clearSession = () => {
    session.value = null;
    localStorage.removeItem("session");
    localStorage.removeItem("token");
  };

  return {
    session,
    role,
    isAuthenticated,
    setSession,
    clearSession,
  };
});
