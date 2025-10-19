<template>
    <div class="search-tab">
        <button @click="showFilters = true">Show filters</button>
        <CardList class="card-list" :cards="store.filteredCards"></CardList>
        <Transition name="slide-up-down">
            <Filters v-if="showFilters" @apply="showFilters = false"></Filters>
        </Transition>

    </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import CardList from './CardList.vue';
import Filters from './Filters.vue';
import { ref } from 'vue';

const store = useMainStore();

const showFilters = ref(true);

</script>

<style scoped>
.search-tab {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.card-list {
    flex-grow: 1;
}
</style>