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
  </div>
</template>

<script setup lang="ts">
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
</script>

<style scoped>
/* Estilos opcionales para el componente de valoraciones */
</style>
