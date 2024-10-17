<template>
  <div class="w-3/4 mx-auto min-h-screen">
    <div class="p-4">
      <img :src="`http://localhost:3000${restaurant?.image}`" alt="Restaurant Image" class="w-full h-64 object-cover rounded-lg shadow-md" />
      <h2 class="text-2xl font-bold mt-4">{{ restaurant?.name }}</h2>
      <p class="text-gray-700 mt-1">{{ restaurant?.location }}</p>
    </div>

    <div v-if="isLoggedIn" class="max-w-md mx-auto mb-6">
      <form @submit.prevent="submitReview" class="p-4 border border-gray-300 rounded">
        <h3 class="text-lg font-bold mb-3">Añadir Valoración</h3>

        <div class="flex mb-4">
          <span 
            v-for="star in stars"
            :key="star"
            @click="setRating(star)"
            @mouseover="hoverRating(star)"
            @mouseleave="resetHover"
            class="cursor-pointer"
          >
            <span
              class="text-3xl"
              :class="star <= (hoveredRating || rating) ? 'text-yellow-500' : 'text-gray-300'"
            >
              ★
            </span>
          </span>
        </div>

        <div class="mb-4">
          <label for="comment" class="block text-sm font-medium text-gray-700">Comentario</label>
          <textarea v-model="newReview.comment" id="comment" rows="3" class="w-full p-2 border rounded mt-1" placeholder="Escribe tu comentario..." required></textarea>
        </div>

        <button type="submit" class="w-full bg-headerColor font-bold text-white py-2 rounded">
          Enviar Valoración
        </button>
      </form>
    </div>

    <h3 class="text-xl text-center font-bold mb-2 mt-6">Valoraciones</h3>
    <div class="w-3/4 mx-auto">
      <div v-if="reviews.length === 0" class="text-gray-500 text-center">No hay valoraciones aún.</div>
      <div v-else>
        <div class="space-y-4">
          <ReviewItem
            v-for="review in reviews"
            :key="review.id"
            :review="review"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import ReviewItem from './ReviewItem.vue';
import { useStore } from 'vuex';

const route = useRoute();
const restaurantId = route.params.id;
const restaurant = ref(null);
const reviews = ref([]);
const newReview = ref({ rating: 0, comment: '', rest_id: restaurantId, user_id: null }); 
const store = useStore();
const userId = computed(() => store.state.userId);
const isLoggedIn = computed(() => store.getters.isLoggedIn);

onMounted(async () => {
  try {
    const restaurantResponse = await axios.get(`http://localhost:3000/api/restaurants/${restaurantId}`);
    restaurant.value = restaurantResponse.data;

    const reviewsResponse = await axios.get(`http://localhost:3000/api/restaurants/${restaurantId}/reviews`);
    reviews.value = reviewsResponse.data; 
  } catch (error) {
    console.error('Error al obtener los detalles del restaurante o las valoraciones:', error);
  }
});

const stars = [1, 2, 3, 4, 5];
const rating = ref(0); 
const hoveredRating = ref(0);

const setRating = (star: number) => {
  rating.value = star; 
  newReview.value.rating = star; 
};

const hoverRating = (star: number) => {
  hoveredRating.value = star; 
};

const resetHover = () => {
  hoveredRating.value = 0; 
};

const submitReview = async () => {
  newReview.value.user_id = userId.value; 

  if (rating.value <= 0 || !newReview.value.comment) {
    alert('Por favor, completa todos los campos antes de enviar. Asegúrate de seleccionar una calificación.');
    return;
  }

  try {
    await axios.post(`http://localhost:3000/api/restaurants/${restaurantId}/reviews`, {
      rating: newReview.value.rating,
      comment: newReview.value.comment,
      rest_id: newReview.value.rest_id,
      user_id: newReview.value.user_id,
    });

    newReview.value = { rating: 0, comment: '', rest_id: restaurantId, user_id: null };
    rating.value = 0;

    alert('Valoración enviada con éxito');
    const reviewsResponse = await axios.get(`http://localhost:3000/api/restaurants/${restaurantId}/reviews`);
    reviews.value = reviewsResponse.data; 

  } catch (error) {
    console.error('Error al enviar la valoración:', error);
    alert('Hubo un problema al enviar tu valoración. Por favor, intenta de nuevo.');
  }
};
</script>

<style scoped>
h3 {
  border-bottom: 2px solid #e2e8f0; 
  padding-bottom: 0.5rem; 
}

.bg-headerColor {
    background-color: #1a202c;
}
</style>