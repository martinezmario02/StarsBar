<script setup lang="ts">
  import PageHeader from './components/PageHeader.vue';
  import RestaurantList from './components/RestaurantList.vue';
</script>

<template>
  <PageHeader />

  <div id="app">
    <router-view />
  </div>
</template>
