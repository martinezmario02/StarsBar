<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';

const authenticated = ref(false);
const showLogin = ref(false);
const name = ref('');
const mail = ref('');
const pass = ref('');
const loginError = ref('');
const store = useStore();

const toggleLoginForm = () => {
  showLogin.value = !showLogin.value;
};

const login = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      mail: mail.value,
      pass: pass.value
    });

    if (response.data.success) {
      authenticated.value = true;
      showLogin.value = false;
      name.value = response.data.name;
      store.dispatch('login', { userId: response.data.id, rol: response.data.rol });
      mail.value = '';
      pass.value = '';
      loginError.value = ''; 
    } else {
      loginError.value = 'Correo o contraseña incorrectos.';
    }
  } catch (error) {
    loginError.value = 'Error al intentar iniciar sesión.';
    console.error('Error en el inicio de sesión:', error);
  }
};

const logout = () => {
  authenticated.value = false;
  name.value = '';
  store.dispatch('logout');
};
</script>

<template>
  <div class="relative py-10 bg-headerColor">
    <div class="text-center text-white">
      <h1 class="text-4xl font-bold tracking-widest">StarsBar</h1>
      <h6 class="mt-4 text-xl">Comer bien, nunca fue tan fácil</h6>
      <div class="tracking-widest py-1">
        <i class="fas fa-star text-yellow-400"></i>
        <i class="fas fa-star text-yellow-400"></i>
        <i class="fas fa-star text-yellow-400"></i>
        <i class="fas fa-star text-yellow-400"></i>
        <i class="fas fa-star text-yellow-400"></i>
      </div>
    </div>

    <div class="absolute top-5 right-5">
      <div v-if="!authenticated" class="text-center">
        <button @click="toggleLoginForm" class="bg-white hover:bg-gray-300 text:bg-headerColor font-bold py-2 px-4 rounded">Iniciar sesión</button>
        <p class="text-white">¿Aún no estás registrado?</p>
        <router-link to="/register" class="text-white font-bold underline hover:text-yellow-400">Regístrate aquí</router-link>
      </div>
      <div v-else>
        <p class="text-white">Bienvenido, {{ name }}</p>
        <button @click="logout" class="bg-white hover:bg-gray-300 text:bg-headerColor font-bold py-2 px-4 rounded">Cerrar sesión</button>
      </div>
    </div>

    <div v-if="showLogin" class="login-modal">
      <label class="block mb-2 font-bold">Correo:</label>
      <input v-model="mail" type="email" class="border p-2 rounded mb-4 w-full" placeholder="Correo electrónico" />

      <label class="block mb-2 font-bold">Contraseña:</label>
      <input v-model="pass" type="password" class="border p-2 rounded mb-4 w-full" placeholder="Contraseña" />

      <button @click="login" class="bg-headerColor hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Iniciar sesión</button>

      <div v-if="loginError" class="text-red-500 mt-2">{{ loginError }}</div>
    </div>
  </div>
</template>

<style scoped>
.login-modal {
  position: fixed; 
  top: 100px; 
  right: 20px; 
  width: 300px; 
  padding: 1rem;
  background-color: white; 
  border-radius: 8px; 
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); 
  z-index: 1000;
}

.bg-headerColor {
  background-color: #1a202c;
}

button, p {
  margin: 10px 0;
}
</style>
