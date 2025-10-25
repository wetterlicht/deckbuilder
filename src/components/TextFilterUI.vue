<template>
    <div class="text-filter-ui">
        <ul v-if="filterGroup.filters.length > 0">
            <li v-for="(filter, index) in filterGroup.filters">
                <div class="filter-value">
                    <button @click="toggleOperator(index)" class="filter-toggle">
                        <div :class="getFilterOperatorClasses(filter.operator)">
                        </div>
                        <div class="filter-text">{{ filter.text
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
            <input type="text" v-model="text" aria-label="Filter text"></input>
            <button :disabled="text.length === 0">Add</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { type TextFilterGroup, type TextFilter, type TextOperator } from '@/types';
import { ref, type PropType } from 'vue';

const props = defineProps({
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

function getFilterOperatorClasses(operator: string) {
    return { 'filter-operator': true, 'filter-operator--exclude': operator === 'exclude', 'filter-operator--include': operator === 'include' };
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
.text-filter-ui {
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

                &::before {
                    content: '';
                    display: block;
                    width: 1rem;
                    height: 1rem;
                    background-color: white;
                    mask-repeat: no-repeat;
                    mask-size: cover;
                    mask-position: center;
                }
            }

            .filter-operator--include {
                background-color: var(--c-indigo);

                &::before {
                    mask-image: url('/images/add.svg');
                }
            }

            .filter-operator--exclude {
                background-color: hsl(0, 60%, 50%);

                &::before {
                    mask-image: url('/images/remove.svg');
                }
            }
        }

        .filter-text {
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
    grid-template-columns: 1fr auto;
    column-gap: 1rem;

    input {
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