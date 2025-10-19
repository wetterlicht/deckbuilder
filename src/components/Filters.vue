<template>
    <div class="filters">
        <div>
            <TextFilterUI label="Gameplay Text" :filterGroup="localFilterGroups['gameplayText']" stat="gameplayText"
                @update="(group: TextFilterGroup) => setLocalFilterGroup('gameplayText', group)">
            </TextFilterUI>

            <NumberFilterUI label="Cost" :filterGroup="localFilterGroups['cost']" stat="cost"
                @update="(group: NumberFilterGroup) => setLocalFilterGroup('cost', group)">
            </NumberFilterUI>

            <NumberFilterUI label="Lore" :filterGroup="localFilterGroups['lore']" stat="lore"
                @update="(group: NumberFilterGroup) => setLocalFilterGroup('lore', group)"></NumberFilterUI>

            <NumberFilterUI label="Strength" :filterGroup="localFilterGroups['strength']" stat="strength"
                @update="(group: NumberFilterGroup) => setLocalFilterGroup('strength', group)">
            </NumberFilterUI>

            <NumberFilterUI label="Willpower" :filterGroup="localFilterGroups['willpower']" stat="willpower"
                @update="(group: NumberFilterGroup) => setLocalFilterGroup('willpower', group)">
            </NumberFilterUI>

            <NumberFilterUI label="Move Cost" :filterGroup="localFilterGroups['moveCost']" stat="moveCost"
                @update="(group: NumberFilterGroup) => setLocalFilterGroup('moveCost', group)">
            </NumberFilterUI>

            <TextFilterUI label="Flavor Text" :filterGroup="localFilterGroups['flavorText']" stat="flavorText"
                @update="(group: TextFilterGroup) => setLocalFilterGroup('flavorText', group)">
            </TextFilterUI>
        </div>

        <button @click="applyFilters">Apply Filters</button>
        <button @click="clearFilters">Clear Filters</button>
    </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import type {
    Stat,
    FilterGroupByStat,
    NumberFilterGroup,
    TextFilterGroup,
} from '@/types';
import { ref } from 'vue';
import NumberFilterUI from './NumberFilterUI.vue';
import TextFilterUI from './TextFilterUI.vue';

const emit = defineEmits(['apply'])

const store = useMainStore();

const localFilterGroups = ref<FilterGroupByStat>(JSON.parse(JSON.stringify(store.filterGroups!)));

function setLocalFilterGroup<K extends Stat>(stat: K, group: FilterGroupByStat[K]) {
    localFilterGroups.value[stat] = group;
}

function applyFilters() {
    store.setFilterGroups(localFilterGroups.value);
    emit('apply')
}

function clearFilters() {
    store.clearFilterGroups();
    emit('apply')
}

</script>

<style scoped>
.filters {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100vw;
    height: calc(100vh - 3.5rem);
    background-color: var(--c-kelp);
    color: white;
    overflow: auto;
}
</style>