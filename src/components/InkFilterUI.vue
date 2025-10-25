<template>
    <div>
        <label class="custom-select">
            <CustomSelect id="ink-operator" v-model="store.inkFilter.operator">
                <option value="<=">At most</option>
                <option value=">=">At least</option>
                <option value="=">Exactly</option>
            </CustomSelect>
        </label>

        <ul class="inks">
            <li v-for="ink in store.inks">
                <label :for="`ink-checkbox-${ink}`">
                    <img :src="`/images/${ink.toLowerCase()}.svg`" :alt="ink">
                </label>
                <input :id="`ink-checkbox-${ink}`" type="checkbox" :value="ink" v-model="store.inkFilter.inks"></input>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import CustomSelect from './CustomSelect.vue';

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

    li img {
        width: 3.125rem;
    }
}
</style>