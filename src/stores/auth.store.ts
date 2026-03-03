import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const session = ref(JSON.parse(localStorage.getItem("session") || "null"));
  const setSession = (data: typeof session.value) => {
    session.value = data;
    localStorage.setItem("session", JSON.stringify(data));
  };

  const clearSession = () => {
    session.value = null;
    localStorage.removeItem("session");
    localStorage.removeItem("token");
  };

  return { session, setSession, clearSession };
});