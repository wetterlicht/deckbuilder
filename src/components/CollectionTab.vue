<template>
    <div class="collection-view">
        <PageHeader>Collection</PageHeader>
        <CardList class="collection-view__card-list" :cards="store.collectionWithCards.cards.map(entry => entry.data)"
            sortBy="cost"></CardList>
        <button class="collection-view__add-cards" @click="showFilters = true">Add Cards</button>
        <Transition name="slide-left-right">
            <Filters v-if="showFilters" @close="showFilters = false"></Filters>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import PageHeader from './PageHeader.vue';
import { useMainStore } from '@/stores/main';
import Filters from './Filters.vue';
import CardList from './CardList.vue';
import { onActivated, ref } from 'vue';

const store = useMainStore()
const showFilters = ref(false);

onActivated(() => {
    store.context = 'collection'
})

</script>

<style scoped>
.collection-view {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.collection-view__add-cards {
    position: fixed;
    bottom: 5rem;
    left: 50%;
    translate: -50%;
    padding: 0.5rem 0.5rem;
    border: none;
    border-radius: 0.125rem;
    background-color: var(--c-gold-dark);
    color: var(--c-gold-light);
    box-shadow: 0 4px 6px 1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.5);
}
</style>