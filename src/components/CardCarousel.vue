<template>
    <div class="card-carousel" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
        <ul class="track" :style="{ transform: `translateX(-${index * 100}vw)` }">
            <li class="card" v-for="(entry, index) in cardsWithQuantities" :data-index="index">
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
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import type { CardData } from '@/types';
import { ref } from 'vue';

const props = defineProps({
    cardsWithQuantities: {
        type: Array<{ quantity: number, card: CardData }>,
        required: true
    }
})

const index = defineModel<number>('index', { required: true });

const emit = defineEmits(['close'])

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

function nextCard() {
    if (index.value < props.cardsWithQuantities.length - 1) {
        index.value++
    }
}

function prevCard() {
    if (index.value > 0) {
        index.value--
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
    height: calc(100vh - 3.5rem);
    background-color: var(--c-kelp);
    color: white;
    overflow: hidden;
}

.track {
    display: flex;
    width: 100%;
    height: 100%;
    transition: transform 0.4s ease-in-out;
}

.card {
    width: 100vw;
    height: 100%;
    flex-shrink: 0;
    padding-top: 1rem;
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
    justify-content: flex-end;
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
</style>