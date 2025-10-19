<template>
    <li class="card-row">
        <div class="card-row__image" :class="imageClass"><img :src="image" :alt="card.fullName"
                @click="emit('selected')"></img>
        </div>
        <div class="card-row__info" @click="emit('selected')">
            <div class=" card-row__name">{{ card.fullName }}</div>
            <div class="card-row__cost">
                <div class="cost" :class="costIconClass">{{ card.cost }}</div>
                <div class="inks">
                    <img v-for="ink in card.inks" :src="`/images/${ink.toLowerCase()}.svg`" :alt="ink">
                </div>
            </div>
        </div>
        <div class="card-row__quantity">
            <template v-if="quantity > 0">
                <button @click="store.removeCardFromCurrentDeck(card.id)">
                    <div class="icon-remove"></div>
                </button>
                <div>{{ quantity }}</div>
            </template>
            <button @click="store.addCardToCurrentDeck(card.id)">
                <div class="icon-add"></div>
            </button>
        </div>
    </li>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import type { CardData } from '@/types';
import { computed, type PropType } from 'vue';

const props = defineProps({
    card: {
        type: Object as PropType<CardData>,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['selected']);

const image = computed(() => {
    if (props.card.types.includes("Location")) {
        return props.card.images.small
    }
    return props.card.images.small
});

const imageClass = computed(() => {
    return {
        'card-row__image--location': props.card.types.includes("Location"),
        'card-row__image--item': props.card.types.includes("Item")
    }
})

const costIconClass = computed(() => {
    return {
        'inkable': props.card.inkwell,
        'uninkable': !props.card.inkwell
    }
})

const store = useMainStore();
</script>

<style scoped>
.card-row {
    color: white;
    display: flex;
    align-items: center;
    padding-inline: 0.5rem;
    padding-block: 0.25rem;
}

.card-row__info {
    flex-grow: 1;
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
    flex-shrink: 0;
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

.inks {
    display: flex;
}

.card-row__quantity {
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