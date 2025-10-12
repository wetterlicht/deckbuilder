<template>
    <RouterLink class="back-button" :to="to">

    </RouterLink>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { RouteLocationAsRelativeGeneric } from 'vue-router';

defineProps({
    to: {
        type: Object as PropType<RouteLocationAsRelativeGeneric>,
        required: true
    }
})
</script>

<style scoped>
.back-button {
    background-color: white;
    width: 1.5rem;
    height: 1.5rem;
    border: none;
}
</style>