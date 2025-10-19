<template>
    <nav class="navigation-bar">
        <ul>
            <li v-for="tab in tabs">
                <button class="tab" :class="getTabClass(tab.path)" @click="onTabClick(tab.path)">
                    <div class=" tab__icon" :style="getIconStyle(tab.icon)">
                    </div>
                    <div class="tab__name">
                        {{ tab.name }}
                    </div>
                </button>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { useTabStore } from '@/stores/tabs';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const tabsStore = useTabStore();

const tabs = [
    {
        icon: 'collection',
        name: 'Collection',
        path: '/collection',
    },
    {
        name: 'Decks',
        icon: 'deck',
        path: '/decks',
    },
    {
        icon: 'search',
        name: 'Search',
        path: '/search'
    },
];

function getTabClass(path: string) {
    const root = "/" + route.path.split('/')[1];
    return {
        'tab--active': root && path.startsWith(root)
    }
}

function getIconStyle(iconName: string) {
    const url = `/images/${iconName}.svg`
    return {
        maskImage: `url(${url})`,
    }
}

function onTabClick(tabPath: string) {
    const currentRoot = '/' + route.path.split('/')[1];
    if (currentRoot === tabPath) {
        tabsStore.clearLastVisited(tabPath);
        router.push(tabPath);
    } else {
        router.push(tabsStore.getLastVisited(tabPath));
    }
}

</script>

<style scoped>
.navigation-bar {
    background-color: #000;
    height: 3.5rem;
    font-size: 0.75rem;
    z-index: 100;
}

.navigation-bar ul {
    display: flex;
    justify-content: space-around;
    column-gap: 1rem;
    padding-inline: 1rem;
    height: 100%;
}

.tab {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    row-gap: 0.125rem;
    text-decoration: none;
    background: none;
    border: none;

    --c-tab-text: hsl(0, 0%, 80%);
    --c-tab-icon: hsl(0, 0%, 50%);
    color: var(--c-tab-text);

    &.tab--active {
        --c-tab-color: hsl(0, 0%, 100%);
        --c-tab-icon: hsl(0, 0%, 100%);
    }
}

.tab__icon {
    color: var(--c-tab-icon);
    width: 1.5rem;
    height: 1.5rem;
    background-color: currentColor;
    mask-repeat: no-repeat;
    mask-size: cover;
    mask-position: center;
}
</style>