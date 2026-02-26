<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

import { loginSchema } from "../schemas/auth.schemas";
import { useRouter } from "vue-router";

import logo from "../assets/novacodepng.png";

const email = ref<string>("");
const password = ref<string>("");
const errorMessage = ref<string>("");

const router = useRouter();

const isFormValid = computed(() => {
  return email.value.trim() !== "" && password.value.trim() !== "";
});

const login = async () => {
  errorMessage.value = "";

  try {
    const result = loginSchema.safeParse({
      email: email.value,
      password: password.value,
    });

    if (!result.success) {
      errorMessage.value = result.error.issues[0]?.message ?? "Datos invalidos";
      return;
    }

    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/home");
  } catch (error: any) {
    errorMessage.value = "Credenciales incorrectas";
  }
};

watch([email, password], () => {
  errorMessage.value = "";
});
</script>

<template>
  <div class="container">
    <div class="card">
      <img :src="logo" alt="Logo" class="logo" />
      <h2>Iniciar sesión</h2>

      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Correo" />
        <input v-model="password" type="password" placeholder="Contraseña" />
        <button  v-if="isFormValid" type="submit">Entrar</button>

        <p v-if="errorMessage" class="error">
          {{ errorMessage }}
        </p>
      </form>

    </div>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
}

.logo {
  width: 110px;
  display: block;
  margin: 0 auto 10px auto;
}

.error {
  color: red;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 500;
}

.card {
  width: 350px;
  padding: 2rem;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

h2 {
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: black;
}

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  transition: border 0.2s ease;
  background-color: #ffffff;
  color: black;
}

input:focus {
  outline: none;
  border: 1px solid #333;
}

button {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background: #000000;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

button:hover {
  opacity: 0.85;
}
</style>