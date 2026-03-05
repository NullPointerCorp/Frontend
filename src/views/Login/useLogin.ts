import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth.store";
import { authService } from "@/services/auth.service";
import { auth } from "../../firebase"; // tu configuración de Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { loginSchema } from "../../schemas/auth.schemas";

export const useLogin = () => {
  const router = useRouter();
  const authStore = useAuthStore();

  const email = ref<string>("");
  const password = ref<string>("");
  const errorMessage = ref<string>("");

  // Validación básica
  const isFormValid = computed(() => {
    return email.value.trim() !== "" && password.value.trim() !== "";
  });

  const login = async () => {
    errorMessage.value = "";

    // Validación con Zod
    const validation = loginSchema.safeParse({ email: email.value, password: password.value });
    if (!validation.success) {
      errorMessage.value = validation.error.issues[0]?.message ?? "Datos inválidos";
      return;
    }

    try {
      // Login en Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
      const token = await userCredential.user.getIdToken();

      const sessionData = await authService.getSession(token);

      // Guardar sesión en Pinia
      authStore.setSession(sessionData);

      // Guardar token local
      localStorage.setItem("token", token);

      // Redirigir al dashboard
      router.replace("/dashboard");

    } catch (err: any) {
      console.error("Firebase login error:", err);
      console.error("code:", err.code);
      console.error("message:", err.message);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        errorMessage.value = "Correo o contraseña incorrectos";
      } else {
        errorMessage.value = "Error al iniciar sesión. Intenta de nuevo.";
      }
    }
  };

  // Limpiar errores cuando usuario escriba
  watch([email, password], () => {
    errorMessage.value = "";
  });

  return { email, password, errorMessage, isFormValid, login };
};