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
                <div class="deck-view__total_quantity">{{ totalQuantity }} {{ totalQuantity == 1 ? 'card' : 'cards' }}
                </div>
            </template>
        </PageHeader>
        <CardList class="deck-view__card-list" :cards="deck.cards.map(entry => entry.data)" sort="cost"></CardList>
        <button class="deck-view__add-cards" @click="showFilters = true">Add Cards</button>
        <Transition name="slide-left-right">
            <Filters v-if="showFilters" @close="showFilters = false"></Filters>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main';

import { useRoute } from 'vue-router';
import { computed, onActivated, ref } from 'vue';
import BackButton from './BackButton.vue';
import PageHeader from './PageHeader.vue';
import CardList from './CardList.vue';
import Filters from './Filters.vue';

const store = useMainStore();
const route = useRoute();

onActivated(() => {
    store.context = 'deck'
    store.setCurrentDeck(route.params.id as string)
})

const deck = computed(() => store.currentDeckWithCards)

const totalQuantity = deck.value.cards.reduce((acc, cur) => acc + cur.quantity, 0)

const showFilters = ref(false);

</script>

<style scoped>
.deck-view {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.deck-view__total_quantity {
    color: white;
    font-size: 0.875rem;
    font-weight: normal;
}

.deck-view__card-list {
    padding-bottom: 5.5rem;
}

.deck-view__add-cards {
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
    height: calc(100dvh - 3.5rem);
    margin: 0;
    max-width: unset;
    max-height: unset;
    border: none;
    outline: none;
    background-color: var(--c-kelp);
    padding: 0;

    &::backdrop {
        width: 100vw;
        height: calc(100dvh - 3.5rem);
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