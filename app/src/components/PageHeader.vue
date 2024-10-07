<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const authenticated = ref(false);
const showLogin = ref(false);
const name = ref('');
const mail = ref('');
const pass = ref('');
const loginError = ref('');

// Login:
const toggleLoginForm = () => {
  showLogin.value = !showLogin.value;
};

const login = async () => {
  try {
    if(!authenticated.value){
        const response = await axios.post('http://localhost:3000/api/login', {
        mail: mail.value,
        pass: pass.value
        });

        if (response.data.success) {
        authenticated.value = true;
        showLogin.value = false;
        name.value = response.data.name;
        } else {
        loginError.value = 'Correo o contraseña incorrectos.';
        }
    } else {
        authenticated.value = false;
        name.value = '';
    }
  } catch (error) {
    loginError.value = 'Error al intentar iniciar sesión.';
    console.error('Error en el inicio de sesión:', error);
  }
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
            <button v-if="!authenticated" @click="toggleLoginForm" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Iniciar sesión</button>
            <div v-else class="text-white">
                <p>Bienvenido, {{ name }}</p>
                <button @click="login" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Cerrar sesión</button>
            </div>
        </div>

        <div v-if="showLogin" class="mt-4 p-4 bg-gray-200 rounded">
            <label class="block mb-2">Correo:</label>
            <input v-model="mail" type="email" class="border p-2 rounded mb-4 w-full" placeholder="Correo electrónico" />

            <label class="block mb-2">Contraseña:</label>
            <input v-model="pass" type="password" class="border p-2 rounded mb-4 w-full" placeholder="Contraseña" />

            <button @click="login" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Iniciar sesión</button>

            <div v-if="loginError" class="text-red-500 mt-2">{{ loginError }}</div>
        </div>
    </div>
</template>

<style scoped>
.bg-headerColor {
    background-color: #1a202c;
}

button, p {
    margin: 10px 0
}
</style>
