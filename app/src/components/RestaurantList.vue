<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import RestaurantItem from './RestaurantItem.vue';
import { useRouter } from 'vue-router';
import { API_URL } from '../main';

const restaurants = ref([]);
const router = useRouter();

// Get restaurants:
onMounted(async () => {
  try {
    const response = await axios.get(`${API_URL}/api/restaurants`);
    console.log('Datos de restaurantes:', response.data);
    restaurants.value = response.data;
  } catch (error) {
    console.error('Error al obtener los restaurantes:', error);
  }
});

// Redirect to restaurant page:
const goToRestaurant = (id: number) => {
  router.push(`/restaurant/${id}`); 
};
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
    <div v-for="restaurant in restaurants" :key="restaurant.id" class="border m-4 border-gray-300 rounded p-3 cursor-pointer" @click="goToRestaurant(restaurant.id)">
      <RestaurantItem :restaurant="restaurant" />
    </div>
  </div>
</template>

<style scoped>
/* Estilos para la lista de restaurantes */
</style>
