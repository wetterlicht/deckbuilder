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

<style scoped></style>