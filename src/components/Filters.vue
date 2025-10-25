<template>
    <div class="filters" :class="{ 'filters-hidden': showResults }">
        <PageHeader>
            <template #left>
                <button class="back-button" @click="close"></button>
            </template>
            <template #default>
                Filters
            </template>
        </PageHeader>
        <div class="filters__content">
            <div class="search">
                <input id="search" type="text" placeholder="Card name" v-model="store.searchTerm">
                <button class="search__clear" v-if="store.searchTerm" @click="store.searchTerm = ''"></button>
            </div>

            <details>
                <summary>Inks</summary>
                <InkFilterUI></InkFilterUI>
            </details>

            <details>
                <summary>Gameplay Text</summary>
                <TextFilterUI :filterGroup="store.filterGroups['gameplayText']"
                    @update="(group: TextFilterGroup) => setFilterGroup('gameplayText', group)">
                </TextFilterUI>
            </details>

            <details>
                <summary>Cost</summary>
                <NumberFilterUI :filterGroup="store.filterGroups['cost']"
                    @update="(group: NumberFilterGroup) => setFilterGroup('cost', group)">
                </NumberFilterUI>
            </details>

            <details>
                <summary>Lore</summary>
                <NumberFilterUI :filterGroup="store.filterGroups['lore']"
                    @update="(group: NumberFilterGroup) => setFilterGroup('lore', group)"></NumberFilterUI>
            </details>

            <details>
                <summary>Strength</summary>
                <NumberFilterUI :filterGroup="store.filterGroups['strength']"
                    @update="(group: NumberFilterGroup) => setFilterGroup('strength', group)">
                </NumberFilterUI>
            </details>

            <details>
                <summary>Willpower</summary>
                <NumberFilterUI :filterGroup="store.filterGroups['willpower']"
                    @update="(group: NumberFilterGroup) => setFilterGroup('willpower', group)">
                </NumberFilterUI>
            </details>

            <details>
                <summary>Move Cost</summary>
                <NumberFilterUI :filterGroup="store.filterGroups['moveCost']"
                    @update="(group: NumberFilterGroup) => setFilterGroup('moveCost', group)">
                </NumberFilterUI>
            </details>

            <details>
                <summary>Rarities</summary>
                <RarityFilterUI></RarityFilterUI>
            </details>

            <details>
                <summary>Classification</summary>
                <ListFilterUI id="classifications" :filterGroup="store.filterGroups['classifications']"
                    :options="store.classifications" :numberOfColumns="2"
                    @update="(group: ListFilterGroup) => setFilterGroup('classifications', group)"></ListFilterUI>
            </details>

            <details>
                <summary>Story</summary>
                <ListFilterUI id="stories" :filterGroup="store.filterGroups['story']" :options="store.stories"
                    :numberOfColumns="1" @update="(group: ListFilterGroup) => setFilterGroup('story', group)">
                </ListFilterUI>
            </details>

            <details>
                <summary>Flavor Text</summary>
                <TextFilterUI :filterGroup="store.filterGroups['flavorText']"
                    @update="(group: TextFilterGroup) => setFilterGroup('flavorText', group)">
                </TextFilterUI>
            </details>

            <div class="buttons">
                <button class="apply-filters" @click="showResults = true">Show {{ store.filteredCards.length === 1 ? `1
                    result` :
                    `${store.filteredCards.length} results` }}</button>
                <button v-if="hasFilters" class="clear-filters" @click="clearFilters">Clear all filters</button>
            </div>
        </div>
        <Transition name="slide-left-right">
            <Results v-if="showResults" @close="showResults = false"></Results>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import type {
    Stat,
    FilterGroupByStat,
    NumberFilterGroup,
    TextFilterGroup,
    ListFilterGroup,
} from '@/types';
import { computed, ref } from 'vue';
import NumberFilterUI from './NumberFilterUI.vue';
import TextFilterUI from './TextFilterUI.vue';
import ListFilterUI from './ListFilterUI.vue';
import PageHeader from './PageHeader.vue';
import Results from './Results.vue';
import InkFilterUI from './InkFilterUI.vue';
import RarityFilterUI from './RarityFilterUI.vue';

const emit = defineEmits(['close'])

const store = useMainStore();

const showResults = ref(false);

const hasFilters = computed(() => {
    return Object.values(store.filterGroups).reduce((acc, cur) => {
        return acc + cur.filters.length;
    }, 0) > 0;
})

function setFilterGroup<K extends Stat>(stat: K, group: FilterGroupByStat[K]) {
    store.filterGroups[stat] = group;
}

function clearFilters() {
    store.clearFilters();
}

function close() {
    clearFilters();
    emit('close');
}

</script>

<style scoped>
.filters {
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100vw;
    height: calc(100dvh - 3.5rem);
    background-color: var(--c-kelp);
    color: white;
    display: flex;
    flex-direction: column;
}

.filters__content {
    padding-top: 1rem;
    padding-bottom: 5.5rem;
    padding-inline: 1rem;
    overflow: auto;
    flex-grow: 1;
}

.search {
    margin-bottom: 1rem;
    position: relative;
    flex-grow: 1;

    input {
        color: white;
        width: 100%;
        border-radius: 100vh;
        padding-block: 0.5rem;
        padding-inline: 1rem;
        background-color: #333;
        border: none;

        &:focus {
            outline: none;
        }
    }
}

.search__clear {
    position: absolute;
    aspect-ratio: 1;
    width: 1.5rem;
    right: 0.5rem;
    top: 50%;
    translate: 0 -50%;
    color: white;

    background-color: currentColor;
    mask-repeat: no-repeat;
    mask-image: url('/images/close.svg');
    mask-size: cover;
    mask-position: center;
}


.apply-filters {
    padding: 0.5rem 0.5rem;
    border: none;
    border-radius: 0.125rem;
    background-color: var(--c-gold-dark);
    color: var(--c-gold-light);
    box-shadow: 0 4px 6px 1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.5);
}

.clear-filters {
    padding: 0.5rem 0.5rem;
    border: none;
    border-radius: 0.125rem;
    background-color: var(--c-gold-dark);
    color: var(--c-gold-light);
    box-shadow: 0 4px 6px 1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.5);
}

details {
    border-block: 1px solid var(--c-gold);

    summary {
        list-style-type: none;
        padding-block: 1rem;
        display: flex;
        justify-content: space-between;


        &::after {
            content: '';
            display: block;
            width: 1rem;
            aspect-ratio: 1;
            background-color: currentColor;
            mask-repeat: no-repeat;
            mask-image: url('/images/chevron_forward.svg');
            mask-size: cover;
            mask-position: center;
            rotate: 90deg;
            transition: rotate 0.25s;
        }
    }

    &:open summary::after {
        rotate: 270deg;
    }

}

details+details {
    border-top: none;
}

.filters.slide-left-right-enter-active,
.filters.slide-left-right-leave-active {
    .buttons {
        bottom: 1.5rem;
    }
}

.buttons {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 5rem;
    display: flex;
    justify-content: center;
    column-gap: 2rem;
}
</style>