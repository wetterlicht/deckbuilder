<template>
    <div class="deck-view" v-if="deck">
        <PageHeader>
            <template #left>
                <BackButton :to="{ name: 'decks' }"></BackButton>
            </template>
            <template #default>
                <div class="title">
                    <div class="inks">
                        <img v-for="ink in deck.inks" :src="`/images/${ink.toLowerCase()}.svg`" :alt="ink">
                    </div>
                    <div class="name">{{ deck.name }}</div>
                </div>
            </template>
        </PageHeader>
        <div class="search">
            <input id="search" type="text" placeholder="Add cards" v-model="store.searchTerm">
            <button class="search__clear" @click="clearSearchTerm"></button>
        </div>
        <ul class="cards" v-if="store.isSearching" @scroll="onScroll">
            <CardRow v-for="card in filteredCardsWithQuantities" :card="card">
            </CardRow>
        </ul>
        <ul class="cards" v-else>
            <CardRow v-for="card in deck.cards" :card="card">
            </CardRow>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main';

import { useRoute } from 'vue-router';
import CardRow from './CardRow.vue';
import { computed, ref, watch } from 'vue';
import BackButton from './BackButton.vue';
import PageHeader from './PageHeader.vue';

const store = useMainStore();

const id = useRoute().params.id as string;

store.setCurrentDeck(id);

const deck = computed(() => store.currentDeckWithCards)


const VISIBLE_STEP = 50;
const visibleCount = ref(VISIBLE_STEP);

function clearSearchTerm() {
    store.searchTerm = ''
}

const filteredCardsWithQuantities = computed(() => {
    return store.filteredCards.slice(0, visibleCount.value).map(card => {
        const quantity = deck.value?.cards.find(cardInDeck => card.id === cardInDeck.id)?.quantity ?? 0;
        return {
            quantity,
            data: card,
        };
    });
});

function onScroll(event: Event) {
    const target = event.target as HTMLElement;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 100) {
        // Near bottom, load more
        if (visibleCount.value < store.filteredCards.length) {
            visibleCount.value += VISIBLE_STEP;
        }
    }
}

// Reset visibleCount when search term changes (new search)
watch(() => store.searchTerm, () => {
    visibleCount.value = VISIBLE_STEP;
});

</script>

<style scoped>
.deck-view {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.search {
    padding-block: 0.5rem;
    padding-inline: 0.5rem;
    position: relative;

    input {
        color: white;
        width: 100%;
        border-radius: 100vh;
        padding-block: 0.5rem;
        padding-inline: 1rem;
        background-color: #333;
        border: none;
    }
}

.search__clear {
    position: absolute;
    aspect-ratio: 1;
    width: 1.5rem;
    right: 1.5rem;
    top: 50%;
    translate: 0 -50%;
}

.title {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 0.5rem;
}

.inks {
    display: flex;
    align-items: center;

    img {
        height: 1.5rem;
    }
}

.cards {
    flex-grow: 1;
    overflow: auto;
    padding-block: 0.125rem;
}
</style>