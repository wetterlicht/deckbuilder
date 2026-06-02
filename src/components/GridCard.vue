<template>
    <li class="grid-card">
        <div class="grid-card__image" :class="imageClass"><img :src="image" :alt="card.fullName"
                @click="emit('selected')"></img>
        </div>
        <div class="grid-card__quantity">
            <div class="grid-card__quantity-counter">
                <button @click="store.removeCard(card.id)" :disabled="quantity == 0">
                    <div class="icon-remove"></div>
                </button>
                <div>{{ quantity }}</div>
                <button @click="store.addCard(card.id)">
                    <div class="icon-add"></div>
                </button>
            </div>
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
    },
    quantityInCollection: {
        type: Number,
    }
})

const emit = defineEmits(['selected']);

const image = computed(() => {
    return props.card.images.full
});

const imageClass = computed(() => {
    return {
        'grid-card__image--location': props.card.types.includes("Location"),
        'grid-card__image--item': props.card.types.includes("Item")
    }
})

const store = useMainStore();
</script>

<style scoped>
.grid-card {
    color: white;
    padding-inline: 0.5rem;
    padding-block: 0.25rem;
}

.grid-card__image {
    font-size: 1.25rem;
    width: 100%;
    flex-shrink: 0;
    overflow: hidden;
    box-shadow: 0 4px 6px 1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.5);
    border: 1px solid rgb(255 255 255 / 0.35);
    border-radius: 0.5rem;

    img {
        width: 100%;
        height: auto;
    }
}

.grid-card__cost {
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

.grid-card__quantity {
    .grid-card__quantity-counter {
        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 0.5rem;
        min-width: 90px;
        font-size: 0.875rem;

        button {
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
}

.icon-add {
    height: 1.25rem;
    width: 1.25rem;
    background-color: currentColor;
    mask-repeat: no-repeat;
    mask-image: url('/images/add.svg');
    mask-size: cover;
    mask-position: center;
}

.icon-remove {
    height: 1.25rem;
    width: 1.25rem;
    color: white;
    background-color: currentColor;
    mask-repeat: no-repeat;
    mask-image: url('/images/remove.svg');
    mask-size: cover;
    mask-position: center;
}
</style>