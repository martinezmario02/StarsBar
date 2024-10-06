<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import RestaurantItem from './RestaurantItem.vue';

// Crear una referencia para almacenar la lista de restaurantes
const restaurants = ref([]);

// Función que se ejecuta cuando el componente se monta
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/restaurants');
    console.log('Datos de restaurantes:', response.data); // Verifica aquí
    restaurants.value = response.data;
  } catch (error) {
    console.error('Error al obtener los restaurantes:', error);
  }
});

</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
    <div v-for="restaurant in restaurants" :key="restaurant.id" class="border border-gray-300 rounded p-3">
      <RestaurantItem :restaurant="restaurant" />
    </div>
  </div>
</template>

<style scoped>
/* Estilos para la lista de restaurantes */
</style>
