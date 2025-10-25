<template>
    <div class="number-filter-ui">
        <ul v-if="filterGroup.filters.length > 0">
            <li v-for="(filter, index) in filterGroup.filters">
                <div class="filter-value">
                    <button @click="toggleOperator(index)" class="filter-toggle">
                        <div :class="getFilterOperatorClasses(filter.operator)">
                            {{ filter.operator }}
                        </div>
                        <div class="filter-number">{{ filter.number
                        }}</div>
                    </button>
                    <button @click="removeFilter(index)" class="filter-remove">
                    </button>
                </div>
                <button class="filter-combine" @click="toggleCombineWith()"
                    v-if="index < filterGroup.filters.length - 1">
                    {{ filterGroup.combineWith }}
                </button>
            </li>
        </ul>
        <form @submit.prevent="addFilter">
            <CustomSelect v-model="operator">
                <option value="=">=</option>
                <option value="<">&lt;</option>
                <option value=">">&gt;</option>
            </CustomSelect>
            <input type="number" v-model="number" aria-label="Filter number"></input>
            <button>Add</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { type NumberOperator, type NumberFilter, type NumberFilterGroup } from '@/types';
import { ref, type PropType } from 'vue';
import CustomSelect from './CustomSelect.vue';

const props = defineProps({
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

function getFilterOperatorClasses(operator: string) {
    return { 'filter-operator': true, 'filter-operator--exclude': operator === 'exclude', 'filter-operator--include': operator === 'include' };
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
.number-filter-ui {
    display: grid;
    row-gap: 1rem;
    padding-bottom: 1rem;
}

ul {
    display: flex;
    column-gap: 0.5rem;
    row-gap: 0.5rem;
    flex-wrap: wrap;

    li {
        display: flex;
        align-items: center;
        column-gap: 0.5rem;
    }

    .filter-value {
        display: flex;
        align-items: center;
        background-color: var(--c-gold-dark);
        color: var(--c-gold-light);
        border-radius: 0.25rem;
        overflow: hidden;

        .filter-toggle {
            height: 100%;
            background: none;
            border: none;
            padding: 0;
            display: flex;
            align-items: center;


            .filter-operator {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: white;
                display: flex;
                align-items: center;
                width: 1.5rem;
                height: 1.5rem;
                border-right: 1px solid black;
                background-color: var(--c-indigo);
            }
        }

        .filter-number {
            padding-left: 0.25rem;
            color: var(--c-gold-light);
        }

        .filter-remove {
            background: none;
            border: none;
            padding: 0.25rem;

            &::before {
                content: '';
                display: block;
                width: 1rem;
                height: 1rem;
                background-color: var(--c-gold-light);
                mask-repeat: no-repeat;
                mask-image: url('/images/close.svg');
                mask-size: cover;
                mask-position: center;
            }

        }
    }

    .filter-combine {
        border-radius: 100vh;
        background-color: hsl(0 0 20%);
        color: white;
        border: none;
        padding: 0.25rem 0.5rem;
    }
}

form {
    display: grid;
    grid-template-columns: auto 1fr auto;
    column-gap: 1rem;
    margin-bottom: 1rem;

    input {
        min-width: 0;
        background-color: hsl(0, 0%, 20%);
        color: white;
        padding-block: 0.5rem;
        padding-inline: 1rem;
        border: none;
        border-radius: 100vh;

        &:focus {
            outline: none;
        }
    }

    button {
        border-radius: 100vh;
        border: none;
        padding: 0.5rem 1rem;

        background-color: var(--c-gold-dark);
        color: var(--c-gold-light);

        &:disabled {
            background-color: hsl(0, 0%, 20%);
            color: hsl(0, 0%, 60%);
        }
    }
}
</style>