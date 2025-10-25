<template>
    <div>
        <ul class="rarities">
            <li v-for="rarity in store.rarities">
                <label :for="`rarity-checkbox-${rarity}`">
                    <img :src="`/images/${rarity.toLowerCase().split(' ').join('_')}.svg`" :alt="rarity">
                </label>
                <input :id="`rarity-checkbox-${rarity}`" type="checkbox" :value="rarity"
                    v-model="store.rarityFilter.rarities"></input>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main';

const store = useMainStore();
</script>

<style scoped>
ul {
    display: flex;
    column-gap: 0.5rem;
    margin-block: 1rem;

    input {
        appearance: none;
        position: absolute;
    }

    li:has(input:not(:checked)) img {
        filter: brightness(50%);
    }

    img {
        width: 2rem;
        aspect-ratio: 1;
    }
}
</style>