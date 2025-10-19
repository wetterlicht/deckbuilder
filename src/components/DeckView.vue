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
            <button class="search__clear" v-if="store.searchTerm" @click="clearSearchTerm"></button>
        </div>
        <CardList v-if="store.isSearching" :cards="store.filteredCards"></CardList>
        <CardList v-else :cards="deck.cards.map(entry => entry.data)"></CardList>
    </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main';

import { useRoute } from 'vue-router';
import { computed } from 'vue';
import BackButton from './BackButton.vue';
import PageHeader from './PageHeader.vue';
import CardList from './CardList.vue';

const store = useMainStore();

const id = useRoute().params.id as string;

store.setCurrentDeck(id);

const deck = computed(() => store.currentDeckWithCards)

function clearSearchTerm() {
    store.searchTerm = ''
}

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
    color: white;


    background-color: currentColor;
    mask-repeat: no-repeat;
    mask-image: url('/images/close.svg');
    mask-size: cover;
    mask-position: center;
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

.card-details-dialog {
    width: 100vw;
    height: calc(100vh - 3.5rem);
    margin: 0;
    max-width: unset;
    max-height: unset;
    border: none;
    outline: none;
    background-color: var(--c-kelp);
    padding: 0;

    &::backdrop {
        width: 100vw;
        height: calc(100vh - 3.5rem);
        margin: 0;
        max-width: unset;
        max-height: unset;
    }

    .close-button {
        z-index: 1;
        position: absolute;
        right: 1rem;
        top: 1rem;

        display: grid;
        justify-content: center;
        align-items: center;
        padding: 0.25rem;
        border-radius: 100vh;
        border: 2px solid white;
        background-color: transparent;

        .close-button__icon {
            width: 1.5rem;
            aspect-ratio: 1;
            color: white;
            background-color: currentColor;
            mask-repeat: no-repeat;
            mask-image: url('/images/close.svg');
            mask-size: cover;
            mask-position: center;
        }

    }
}

.card-carousel {
    position: relative;
    width: 100vw;
    height: 100%;
    display: grid;
    grid-auto-flow: column;
    padding-block: 1rem;
    padding-inline: 10vw;
    column-gap: 10vw;

    overflow: auto hidden;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;


    &::scroll-button(left) {
        position: absolute;
        left: 0rem;
        top: 15.25rem;
        content: '';
        height: 2.5rem;
        width: 2.5rem;
        color: white;
        background-color: currentColor;
        mask-repeat: no-repeat;
        mask-image: url('/images/chevron_back.svg');
        mask-size: cover;
        mask-position: center;
    }

    &::scroll-button(right) {
        position: absolute;
        right: 0rem;

        top: 15.25rem;
        content: '';
        height: 2.5rem;
        width: 2.5rem;
        color: white;
        background-color: currentColor;
        mask-repeat: no-repeat;
        mask-image: url('/images/chevron_forward.svg');
        mask-size: cover;
        mask-position: center;
    }


    &::scroll-button(*):disabled {
        display: none;
    }
}
</style>