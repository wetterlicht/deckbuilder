<template>
    <div class="group-header">
        <span>{{ groupValue }}</span>
        <span>{{ count }} {{ count == 1 ? 'card' : 'cards' }}</span>
    </div>
</template>

<script setup lang="ts">
import type { GroupBy } from '@/types';
import type { PropType } from 'vue';

defineProps({
    groupBy: {
        type: String as PropType<GroupBy>,
        required: true
    },
    groupValue: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    }
})
</script>

<style scoped>
.group-header {
    color: white;
    font-size: 0.875rem;
    background-color: #333;
    padding: 0.25rem 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>