<template>
    <li class="card-row">
        <div class="card-row__image" :class="imageClass"><img :src="image" :alt="card.data.fullName"></img>
        </div>
        <div class="card-row__info">
            <div class="card-row__name">{{ card.data.fullName }}</div>
            <div class="card-row__cost">
                <div class="cost" :class="costIconClass">{{ card.data.cost }}</div>
                <div class="colors">
                    <img v-for="color in card.data.inks" :src="`/images/${color.toLowerCase()}.svg`" :alt="color">
                </div>
            </div>
        </div>
        <div class="card-row__quantity">
            <template v-if="card.quantity > 0">
                <button @click="store.removeCardFromCurrentDeck(card.data.id)">-</button>
                <div>{{ card.quantity }}</div>
            </template>
            <button @click="store.addCardToCurrentDeck(card.data.id)">+</button>
        </div>
    </li>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import type { CardData } from '@/types';
import { computed, type PropType } from 'vue';

const props = defineProps({
    card: {
        type: Object as PropType<{
            quantity: number,
            data: CardData
        }>,
        required: true
    }
})

const image = computed(() => {
    if (props.card.data.types.includes("Location")) {
        return props.card.data.images.small
    }
    return props.card.data.images.small
});

const imageClass = computed(() => {
    return {
        'card-row__image--location': props.card.data.types.includes("Location"),
        'card-row__image--item': props.card.data.types.includes("Item")
    }
})

const costIconClass = computed(() => {
    return {
        'inkable': props.card.data.inkwell,
        'uninkable': !props.card.data.inkwell
    }
})

const store = useMainStore();
</script>

<style scoped>
.card-row {
    color: white;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    padding-inline: 0.5rem;
    padding-block: 0.25rem;
}

.card-row__info {
    margin-left: 1rem;
    display: grid;
    row-gap: 0.25rem;
}

.card-row__name {
    font-weight: bold;
    font-size: 0.875rem;
    line-height: 1;
}

.card-row__image {
    font-size: 1.25rem;
    width: 3.75em;
    height: 3.375em;

    overflow: hidden;
    border-radius: 0.25rem;

    img {
        width: 3.75em;
        height: 7em;
        object-fit: cover;
        object-position: -1em -0.25em;
    }

    &.card-row__image--item {
        img {
            scale: 1.05;
        }
    }

    &.card-row__image--location {
        img {
            height: 3.75em;
            width: 7em;
            rotate: 90deg;
            scale: 2.375;
            object-position: 14px -23px;
        }
    }
}

.card-row__cost {
    display: flex;
    align-items: center;
    column-gap: 0.5rem;

    img {
        height: 1.5rem;
    }
}

.cost {
    width: 2rem;
    aspect-ratio: 1;
    background-position: center;
    background-size: cover;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.inkable {
    background-image: url("/images/inkwell.svg");
}

.uninkable {
    background-image: url("/images/inkcost.svg");
}

.card-row__quantity {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    column-gap: 0.5rem;
    min-width: 6.25rem;

    button {
        font-size: 1.75rem;
        padding: 0;
        width: 2rem;
        aspect-ratio: 1;
        color: white;
        background: transparent;
        border: none;
    }
}
</style>