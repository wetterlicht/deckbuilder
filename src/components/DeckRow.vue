<template>
    <li class="deck-row">
        <RouterLink :to="to">
            <div class="colors">
                <img v-for="ink in deck.inks" :src="`/images/${ink.toLowerCase()}.svg`" :alt="ink">
            </div>
            <div class="name">{{ deck.name }}</div>
        </RouterLink>
    </li>
</template>

<script setup lang="ts">
import type { DeckDataWithCards } from '@/types';
import { computed, type PropType } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
    deck: {
        type: Object as PropType<DeckDataWithCards>,
        required: true
    }
})

const to = computed(() => {
    return {
        name: 'deck',
        params: { id: props.deck.id }
    }
})
</script>

<style scoped>
.deck-row {
    color: white;
    border-top: 2px solid var(--c-gold);

    &:last-child {
        border-bottom: 2px solid var(--c-gold);
    }
}

.deck-row a {
    padding-block: 0.75rem;
    padding-inline: 0.75rem;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    column-gap: 0.5rem;
    text-decoration: none;
    color: white;
}

.colors {
    display: flex;
    align-items: center;
    gap: 0.125rem;

    img {
        height: 2rem;
    }
}
</style>