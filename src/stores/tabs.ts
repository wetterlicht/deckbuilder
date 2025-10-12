import { defineStore } from "pinia";
import { ref } from "vue";

export const useTabStore = defineStore('tabs', () => {
    const lastVisited = ref<Record<string, string>>({})

    function updateTab(rootPath: string, fullPath: string) {
        lastVisited.value[rootPath] = fullPath
    }

    function getLastVisited(rootPath: string): string {
        return lastVisited.value[rootPath] || rootPath
    }

    function clearLastVisited(rootPath: string) {
        delete lastVisited.value[rootPath]
    }

    return {
        lastVisited,
        updateTab,
        getLastVisited,
        clearLastVisited
    }
})