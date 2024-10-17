<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center text-headerColor">Registro</h2>
        <form @submit.prevent="registerUser">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
            <input v-model="name" type="text" id="name" class="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-headerColor" required />
          </div>
          
          <div class="mb-4">
            <label for="lastName" class="block text-sm font-medium text-gray-700">Apellido</label>
            <input v-model="lastName" type="text" id="lastName" class="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-headerColor" required />
          </div>
          
          <div class="mb-4">
            <label for="location" class="block text-sm font-medium text-gray-700">Ubicación</label>
            <input v-model="location" type="text" id="location" class="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-headerColor" required />
          </div>
  
          <div class="mb-4">
            <label for="mail" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input v-model="mail" type="email" id="mail" class="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-headerColor" required />
          </div>
  
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input v-model="password" type="password" id="password" class="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-headerColor" required />
          </div>
  
          <button type="submit" class="w-full bg-headerColor text-white font-bold py-2 rounded hover:bg-gray-800 transition duration-200">
            Registrarse
          </button>
        </form>
        <p class="mt-4 text-sm text-center">
          ¿Ya tienes una cuenta? 
          <router-link to="/login" class="text-headerColor font-bold underline hover:text-gray-800">Inicia sesión</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const name = ref('');
  const lastName = ref('');
  const location = ref('');
  const mail = ref('');
  const password = ref('');
  const router = useRouter();
  
  const registerUser = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/register', {
        name: name.value,
        lastName: lastName.value,
        location: location.value,
        mail: mail.value,
        password: password.value
      });
  
      if (response.data.success) {
        alert("Usuario registrado correctamente!");
        router.push('/');
      } else {
        alert("Hubo un problema al registrar el usuario. Inténtalo nuevamente.");
      }
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      alert("Error al registrar el usuario.");
    }
  };
  </script>
  
  <style scoped>
  .bg-headerColor {
    background-color: #1a202c;
  }
  </style>
  