<template>
    <fieldset>
        <legend>{{ label }}</legend>
        <ul>
            <li v-for="(filter, index) in filterGroup.filters">
                <button @click="toggleOperator(index)">{{ filter.operator }}</button>
                <span>{{ filter.number
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
                <option value="=">=</option>
                <option value="<">&lt;</option>
                <option value=">">&gt;</option>
            </select>
            <input type="number" v-model="number" aria-label="Filter number"></input>
            <button>Add</button>
        </form>
    </fieldset>
</template>

<script setup lang="ts">
import { type NumberOperator, type NumberFilter, type NumberFilterGroup } from '@/types';
import { ref, type PropType } from 'vue';

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    filterGroup: {
        type: Object as PropType<NumberFilterGroup>,
        required: true,
    }
})

const emit = defineEmits(['update'])

const number = ref<number>(0);
const operator = ref<NumberOperator>("=");

function addFilter() {
    const newFilter: NumberFilter = {
        filterType: 'number',
        operator: operator.value,
        number: number.value,
    };

    const updatedFilters = [...props.filterGroup.filters, newFilter];

    emit('update', {
        ...props.filterGroup,
        filters: updatedFilters,
    });

    number.value = 0;
    operator.value = '=';
}

function toggleOperator(index: number) {
    const updatedFilters = props.filterGroup.filters.map((filter, i) => {
        if (i === index) {
            const nextOperator =
                filter.operator === '=' ? '<' : filter.operator === '<' ? '>' : '=';
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