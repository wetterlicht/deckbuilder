<template>
  <Suspense>
    <template #default>
      <MainApp />
    </template>
    <template #fallback>
      <LoadingScreen />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import "./styles/reset.css";
import "./styles/global.css";
import MainApp from "./components/MainApp.vue";
import LoadingScreen from "./components/LoadingScreen.vue";
</script>


<style scoped></style>
