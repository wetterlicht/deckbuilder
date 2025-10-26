<template>
    <div class="card-carousel" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
        <TransitionGroup tag="div" class="track" name="list">
            <div class="entry" v-for="entry in loadedCards" :key="entry.key">
                <div class="card" v-if="entry.card">
                    <div class="card__title">
                        <div class="card__name">
                            {{ entry.card.name }}
                        </div>
                        <div class="card__version-name">
                            {{ entry.card.version ?? '&nbsp;' }}
                        </div>

                    </div>
                    <img :src="entry.card.images.full" :alt="entry.card.fullName">
                    <div class="quantity">
                        <button @click="store.removeCardFromCurrentDeck(entry.card.id)">
                            <div class="icon-remove"></div>
                        </button>
                        <div>{{ entry.quantity }}</div>
                        <button @click="store.addCardToCurrentDeck(entry.card.id)">
                            <div class="icon-add"></div>
                        </button>
                    </div>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import type { CardData } from '@/types';
import { computed, ref, TransitionGroup } from 'vue';

const props = defineProps({
    cardsWithQuantities: {
        type: Array<{ quantity: number, card: CardData }>,
        required: true
    }
})

const index = defineModel<number>('index', { required: true });

const emit = defineEmits(['close', 'loadMore'])

const store = useMainStore();

const touchStartX = ref(0)
const touchStartY = ref(0)
const minSwipeDistance = 5

function handleTouchStart(e: TouchEvent) {
    const touch = e.changedTouches?.[0]
    if (!touch) { return }
    touchStartX.value = touch.clientX
    touchStartY.value = touch.clientY
}

function handleTouchEnd(e: TouchEvent) {
    const touch = e.changedTouches?.[0]
    if (!touch) return
    const deltaX = touch.clientX - touchStartX.value
    const deltaY = touch.clientY - touchStartY.value

    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (absX < minSwipeDistance && absY < minSwipeDistance) return

    if (absX > absY * 1.5) {
        if (deltaX > 0) {
            prevCard()
        } else {
            nextCard()
        }
    } else if (absY > absX * 1.5) {
        if (deltaY > 0) {
            emit('close')
        }
    }
}

const loadedCards = computed(() => {
    const sliceStart = Math.max(0, index.value - 1)
    const sliceEnd = Math.min(props.cardsWithQuantities.length, index.value + 2)
    const cards: Array<{ key: string, quantity?: number, card?: CardData }> = props.cardsWithQuantities
        .slice(sliceStart, sliceEnd)
        .map(entry => {
            return {
                ...entry,
                key: entry.card.id
            }
        });

    if (index.value === 0) {
        cards.unshift({
            key: "carousel-start"
        })
    } else if (index.value === props.cardsWithQuantities.length - 1) {
        cards.push({
            key: "carousel-end"
        })
    }

    return cards;
});

function nextCard() {
    if (index.value < props.cardsWithQuantities.length - 1) {
        index.value = index.value + 1
    }
}

function prevCard() {
    if (index.value > 0) {
        index.value = index.value - 1
    }
}
</script>

<style scoped>
.card-carousel {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100vw;
    height: calc(100dvh - 3.5rem);
    background-color: var(--c-kelp);
    color: white;
    overflow: hidden;
}

.track {
    display: flex;
    width: 100%;
    height: 100%;
    translate: -100dvw;
}

.entry {
    width: 100vw;
    height: 100%;
    flex-shrink: 0;
    padding-top: 1rem;
}

.card {

    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 1rem;
    color: white;


    img {
        height: 55vh;
        aspect-ratio: 262/365;
        box-shadow: 0 4px 6px 1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.5);
        border: 1px solid rgb(255 255 255 / 0.35);
        border-radius: 0.5rem;
    }

    .card__title {
        .card__name {
            font-size: 1.125rem;
        }
    }
}

.quantity {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 0.5rem;
    min-width: 90px;

    button {
        font-size: 1.75rem;
        padding: 0;
        width: 2rem;
        aspect-ratio: 1;
        color: white;
        background: transparent;
        border: none;
        display: grid;
        justify-content: center;
        align-items: center;
    }
}

.icon-add {
    height: 1.5rem;
    width: 1.5rem;
    background-color: currentColor;
    mask-repeat: no-repeat;
    mask-image: url('/images/add.svg');
    mask-size: cover;
    mask-position: center;
}

.icon-remove {
    height: 1.5rem;
    width: 1.5rem;
    color: white;
    background-color: currentColor;
    mask-repeat: no-repeat;
    mask-image: url('/images/remove.svg');
    mask-size: cover;
    mask-position: center;
}


.list-move,
.list-enter-active,
.list-leave-active {
    transition: transform 0.25s ease;
}

.list-enter-active,
.list-leave-active {
    visibility: hidden;
    pointer-events: none;
}

.list-enter-from {
    transform: translateX(100dvh);
}

.list-leave-to {
    transform: translateX(-100dvh);
}

.list-leave-active {
    position: absolute;
    visibility: hidden;
}
</style>