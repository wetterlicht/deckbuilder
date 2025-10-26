<template>
    <div class="card-list">
        <ul @scroll="onScroll">
            <CardRow v-for="(entry, index) in cardsWithQuantitiesSlice" :card="entry.card" :quantity="entry.quantity"
                @selected="() => showCardCarousel(index)">
            </CardRow>
        </ul>
        <Transition name="slide-up-down">
            <CardCarousel v-if="isCarouselActive" :cardsWithQuantities="cardsWithQuantities"
                v-model:index="carouselIndex" @close="hideCardCarousel">
            </CardCarousel>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import type { CardData } from '@/types';
import CardRow from './CardRow.vue';
import { computed, nextTick, ref, watch } from 'vue';
import { useMainStore } from '@/stores/main';
import CardCarousel from './CardCarousel.vue';

const props = defineProps({
    cards: {
        type: Array<CardData>,
        required: true
    },
    sort: {
        type: String,
        default: 'name'
    }
})

const VISIBLE_STEP = 50;
const visibleCount = ref(VISIBLE_STEP);

const store = useMainStore();

watch(() => props.cards, () => {
    visibleCount.value = VISIBLE_STEP;
});

const cardsWithQuantities = computed(() => {
    return props.cards.map(card => ({
        quantity: store.getDeckQuantity(card.id),
        card
    })).sort((a, b) => {
        if (props.sort === 'cost') {
            if (a.card.cost < b.card.cost) {
                return -1;
            }
            if (a.card.cost > b.card.cost) {
                return 1;
            }
        }

        if (a.card.name < b.card.name) {
            return -1;
        }
        if (a.card.name > b.card.name) {
            return 1;
        }

        return 0;
    })
})

const cardsWithQuantitiesSlice = computed(() => {
    return cardsWithQuantities.value.slice(0, visibleCount.value)
})

function loadMore() {
    if (visibleCount.value < store.filteredCards.length) {
        visibleCount.value += VISIBLE_STEP;
    }
}

function onScroll(event: Event) {
    const target = event.target as HTMLElement;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 100) {
        loadMore();
    }
}

const isCarouselActive = ref(false);

const carouselIndex = ref(0);

watch(carouselIndex, (newIndex) => {
    if (newIndex >= visibleCount.value) {
        visibleCount.value = Math.ceil((newIndex + 1) / VISIBLE_STEP) * VISIBLE_STEP
    }
})

function showCardCarousel(index: number) {
    isCarouselActive.value = true
    carouselIndex.value = index;
}

function hideCardCarousel() {
    isCarouselActive.value = false

    nextTick(() => {
        const listEl = document.querySelector('.card-list')
        const cardEl = listEl?.querySelectorAll('.card-row')?.[carouselIndex.value]
        if (cardEl && cardEl instanceof HTMLElement) {
            cardEl.scrollIntoView({ behavior: 'auto', block: 'center' })
        }
        carouselIndex.value = 0;
    })
}

</script>

<style scoped>
.card-list {
    flex-grow: 1;
    overflow: hidden;

    ul {
        height: 100%;
        overflow: auto;
        padding-block: 0.125rem;
    }
}
</style>