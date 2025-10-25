<template>
    <div class="results">
        <PageHeader>
            <template #left>
                <button class="back-button" @click="emit('close')"></button>
            </template>
            <template #default>
                Search Results
            </template>
        </PageHeader>
        <CardList :cards="store.filteredCards"></CardList>
    </div>
</template>

<script setup lang="ts">
import CardList from './CardList.vue';
import PageHeader from './PageHeader.vue';
import { useMainStore } from '@/stores/main';

const emit = defineEmits(['close']);

const store = useMainStore();

</script>

<style scoped>
.results {
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100vw;
    height: calc(100vh - 3.5rem);
    background-color: var(--c-kelp);
    color: white;
    display: flex;
    flex-direction: column;
}
</style>