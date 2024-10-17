<script setup lang="ts">

interface Props {
  restaurant: {
    id: number;
    name: string;
    location: string;
    image: string; 
  };
}

const props = defineProps<Props>();
</script>

<template>
  <div class="flex flex-col h-56 sm:h-48 overflow-hidden relative bg-gray-100">
    <img :src="`http://localhost:3000${props.restaurant.image}`" alt="Restaurant Image" class="h-32 sm:h-24 w-full object-cover" />
    <div class="p-2">
      <h4 class="text-lg font-bold text-gray-800">{{ props.restaurant.name }}</h4>
      <p class="text-gray-600">{{ props.restaurant.location }}</p>
    </div>
  </div>
</template>

<style scoped>
.bg-gray-100 {
  background-color: #f7fafc;
}

h4 {
  margin: 0;
}

p {
  margin: 0;
}
</style>
