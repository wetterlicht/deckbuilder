<template>
    <main>
        <div class="content">
            <RouterView v-slot="{ Component }">
                <KeepAlive>
                    <component :is="Component" />
                </KeepAlive>
            </RouterView>
        </div>
        <NavigationBar class="navigation-bar" />
    </main>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import NavigationBar from './NavigationBar.vue';

const store = useMainStore();

await store.loadData();
</script>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: var(--c-kelp);
}

.content {
    flex-grow: 1;
    overflow: hidden;
}

.navigation-bar {
    flex-shrink: 0;
}
</style>