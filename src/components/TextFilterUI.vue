<template>
    <fieldset>
        <legend>{{ label }}</legend>
        <ul>
            <li v-for="(filter, index) in filterGroup.filters">
                <button @click="toggleOperator(index)">{{ filter.operator }}</button>
                <span>{{ filter.text
                    }}</span>
                <button @click="removeFilter(index)"><img src="/images/close.svg" alt="Remove filter"></button>

                <button @click="toggleCombineWith()" v-if="index < filterGroup.filters.length - 1"
                    style="margin: 0 8px; font-weight: bold;">
                    {{ filterGroup.combineWith }}
                </button>
            </li>
        </ul>
        <form @submit.prevent="addFilter">
            <select v-model="operator">
                <option value="include">include</option>
                <option value="exclude">exclude</option>
            </select>
            <input type="text" v-model="text" aria-label="Filter text"></input>
            <button>Add</button>
        </form>
    </fieldset>
</template>

<script setup lang="ts">
import { type TextFilterGroup, type TextFilter, type TextOperator } from '@/types';
import { ref, type PropType } from 'vue';

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    filterGroup: {
        type: Object as PropType<TextFilterGroup>,
        required: true,
    }
})

const emit = defineEmits(['update'])

const text = ref<string>("");
const operator = ref<TextOperator>("include");

function addFilter() {
    const newFilter: TextFilter = {
        filterType: 'text',
        operator: operator.value,
        text: text.value,
    };

    const updatedFilters = [...props.filterGroup.filters, newFilter];

    emit('update', {
        ...props.filterGroup,
        filters: updatedFilters,
    });

    text.value = "";
    operator.value = 'include';
}

function toggleOperator(index: number) {
    const updatedFilters = props.filterGroup.filters.map((filter, i) => {
        if (i === index) {
            const nextOperator =
                filter.operator === 'include' ? 'exclude' : 'include'
            return { ...filter, operator: nextOperator };
        }
        return filter;
    });

    emit('update', {
        ...props.filterGroup,
        filters: updatedFilters,
    });
}


function toggleCombineWith() {
    const newCombineWith = props.filterGroup.combineWith === 'AND' ? 'OR' : 'AND';
    emit('update', {
        ...props.filterGroup,
        combineWith: newCombineWith,
    });
}

function removeFilter(index: number) {
    const updatedFilters = props.filterGroup.filters.filter((_, i) => i !== index);

    emit('update', {
        ...props.filterGroup,
        filters: updatedFilters,
    });
}
</script>

<style scoped>
ul {
    display: flex;
    column-gap: 0.25rem;
    row-gap: 0.25rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;

    li {
        display: flex;
        align-items: center;
    }
}
</style>