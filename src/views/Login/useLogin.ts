import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth.store";
import { authService } from "@/services/auth.service";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { loginSchema } from "../../schemas/auth.schemas";

export const useLogin = () => {
  const router = useRouter();
  const authStore = useAuthStore();

  const email = ref<string>("");
  const password = ref<string>("");
  const errorMessage = ref<string>("");
  const loading = ref<boolean>(false);

  // Botón visible solo cuando ambos campos tienen texto
  const isFormValid = computed(() => {
    return email.value.trim() !== "" && password.value !== "";
  });

  const login = async () => {
    errorMessage.value = "";

    const validation = loginSchema.safeParse({ 
      email: email.value.trim(), 
      password: password.value 
    });
    
    if (!validation.success) {
      errorMessage.value = validation.error.issues[0]?.message ?? "Datos inválidos";
      return;
    }

    loading.value = true;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
      const token = await userCredential.user.getIdToken();
      const sessionData = await authService.getSession(token);

      authStore.setSession(sessionData);
      localStorage.setItem("token", token);
      router.replace("/dashboard");

    } catch (err: any) {
      if (
        err.code === "auth/invalid-credential" || 
        err.code === "auth/wrong-password" || 
        err.code === "auth/user-not-found"
      ) {
        errorMessage.value = "Correo o contraseña incorrectos";
      } else {
        errorMessage.value = "Error al iniciar sesión. Intenta de nuevo.";
      }
    } finally {
      loading.value = false;
    }
  };

  watch([email, password], () => {
    errorMessage.value = "";
  });

  return { email, password, errorMessage, isFormValid, loading, login };
};