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
    border: none;
    color: white;
    width: 1.5rem;
    height: 1.5rem;
    background-color: currentColor;
    mask-image: url("/images/back.svg");
    mask-repeat: no-repeat;
    mask-size: cover;
    mask-position: center;
}
</style>