<template>
  <div class="border-b border-gray-300 py-2 flex items-start">
    <div class="flex flex-col w-full">
      <span class="font-bold text-lg">{{ review.name }}</span>
      <span class="text-sm text-gray-500">{{ formatDate(review.created_at) }}</span>
      <span class="text-gray-600 text-sm overflow-hidden break-words">
        {{ review.comment }}
      </span>
    </div>
    <span class="text-yellow-500 font-bold text-xl ml-4">{{ review.rating }} ⭐</span>
    <button v-if="isAdmin" @click="deleteReview(review.id)" class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-200">
      <i class="fas fa-trash-alt"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();
const isAdmin = computed(() => store.getters.isAdmin);

interface Props {
  review: {
    id: number;
    user_id: number;
    rest_id: number;
    rating: number;
    comment: string;
    name: string;
    created_at: string;
  };
}

const props = defineProps<Props>();

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(',', '');
};

const deleteReview = async (reviewId: number) => {
  try {
    const response = await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`);
    if (response.data.success) {
      alert('Reseña eliminada correctamente');
    } else {
      alert('Hubo un problema al eliminar la reseña');
    }
  } catch (error) {
    console.error('Error al eliminar la reseña:', error);
    alert('Error al eliminar la reseña');
  }
};
</script>

<style scoped>
/* Estilos opcionales para el componente de valoraciones */
</style>
