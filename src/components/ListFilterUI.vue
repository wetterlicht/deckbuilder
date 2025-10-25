<template>
    <div class="list-filter-ui">
        <input type="text" v-model="text" placeholder="Filter &hellip;"></input>
        <ul v-if="filteredOptions" :style="columnStyle">
            <li v-for="(option, index) in filteredOptions">
                <label :for="`${id}-checkbox-${index}`">{{ option.label }}</label>
                <input :id="`${id}-checkbox-${index}`" type="checkbox" :value="option" :checked="option.checked"
                    @change="toggleFilter(option.label)"></input>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { type ListFilterGroup, type ListFilter, type ListOperator } from '@/types';
import { computed, ref, type ComputedRef, type PropType } from 'vue';

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    filterGroup: {
        type: Object as PropType<ListFilterGroup>,
        required: true,
    },
    options: {
        type: Array<string>,
        required: true,
    },
    numberOfColumns: {
        type: Number,
        default: 1
    }
})

const emit = defineEmits(['update'])

const text = ref<string>("");
const operator = ref<ListOperator>("include");

const filteredOptions: ComputedRef<Array<{ label: string, checked: boolean }>> = computed(() => {
    return props.options.filter(option => option.toLowerCase().includes(text.value.toLowerCase())).map(option => {
        return {
            label: option,
            checked: props.filterGroup.filters.findIndex(filter => filter.value === option) >= 0
        }
    });;
})

const columnStyle = computed(() => {
    return {
        'grid-template-columns': '1fr '.repeat(props.numberOfColumns).trim()
    }
})

function toggleFilter(value: string) {
    const filterIndex = props.filterGroup.filters.findIndex(filter => filter.value === value)
    if (filterIndex >= 0) {
        removeFilter(filterIndex);
    } else {
        addFilter(value);
    }
}

function addFilter(value: string) {
    const newFilter: ListFilter = {
        filterType: 'list',
        operator: operator.value,
        value
    };

    const updatedFilters = [...props.filterGroup.filters, newFilter];

    emit('update', {
        ...props.filterGroup,
        filters: updatedFilters,
    });
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

function removeFilter(index: number) {
    const updatedFilters = props.filterGroup.filters.filter((_, i) => i !== index);

    emit('update', {
        ...props.filterGroup,
        filters: updatedFilters,
    });
}
</script>

<style scoped>
.list-filter-ui {
    padding-bottom: 1rem;
}

input[type=text] {
    background-color: hsl(0, 0%, 20%);
    color: white;
    padding-block: 0.5rem;
    padding-inline: 1rem;
    border: none;
    border-radius: 100vh;
    width: 100%;
    line-height: 1.5;

    &:focus-visible {
        border-bottom-width: 2px;
        margin-bottom: -1px;
    }

    &:focus {
        outline: none;
    }
}

ul {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 0.5rem;
    row-gap: 0.5rem;
    margin-top: 1rem;

    input {
        appearance: none;
        position: absolute;
    }

    label {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 0.25rem 0.5rem;
        background-color: hsl(0 0% 20%);
        color: hsl(0 0% 60%);
        width: 100%;
        height: 100%;
    }

    li:has(input:checked) label {
        background-color: var(--c-gold-dark);
        color: var(--c-gold-light);
    }
}
</style>