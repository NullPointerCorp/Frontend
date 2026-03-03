import { ref, computed, watch } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { loginSchema } from "../../schemas/auth.schemas";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth.store";

export const useLogin = () => {
  const authStore = useAuthStore();
  const router = useRouter();

  const email = ref<string>("");
  const password = ref<string>("");
  const errorMessage = ref<string>("");

  const isFormValid = computed(() => {
    return email.value.trim() !== "" && password.value.trim() !== "";
  });

  const login = async () => {
    errorMessage.value = "";

    try {
      const result = loginSchema.safeParse({ email: email.value, password: password.value });

      if (!result.success) {
        errorMessage.value = result.error.issues[0]?.message ?? "Datos invalidos";
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
      const token = await userCredential.user.getIdToken();

      const response = await fetch("http://localhost:3000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sessionData = await response.json();

      if (!response.ok) {
        errorMessage.value = "No autorizado";
        return;
      }

      authStore.setSession(sessionData);
      localStorage.setItem("token", token);
      router.push("/dashboard");

    } catch {
      errorMessage.value = "Credenciales incorrectas";
    }
  };

  watch([email, password], () => {
    errorMessage.value = "";
  });

  return { email, password, errorMessage, isFormValid, login };
};