<template>
    <div class="decks-view">
        <PageHeader>Decks</PageHeader>
        <ul class="decks">
            <DeckRow :deck="deck" v-for="deck in store.decksWithCards"></DeckRow>
        </ul>
        <div class="menu">
            <div v-if="isMenuOpen" class="menu-items">
                <div class="menu-item"><span>Import Deck</span><button>
                        <div class="import-icon"></div>
                    </button></div>
                <div class="menu-item" @click="showNewDeckDialog"><span>New Deck</span><button>
                        <div class="add-icon"></div>
                    </button></div>
            </div>
            <button class="toggle" @click="toggleMenu">
                <div class="toggle__icon" :class="{ 'toggle__icon--close': isMenuOpen }"></div>
            </button>
        </div>

        <dialog ref="newDeckDialog" class="base-dialog new-deck-dialog">
            <form @submit.prevent="addNewDeck">
                <label for="new-deck-name">Name</label>
                <input type="text" id="new-deck-name" v-model="newDeckName" required>
                <div class="buttons"><button class="action-button action-button--secondary" type="button"
                        @click="newDeckDialog?.close()">Cancel</button><button class="action-button"
                        type="submit">Create</button>
                </div>
            </form>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import PageHeader from './PageHeader.vue';
import DeckRow from './DeckRow.vue';
import { useMainStore } from '@/stores/main';
import { ref } from 'vue';
import router from '@/router';

const store = useMainStore()
const isMenuOpen = ref<Boolean>(false);
const newDeckDialog = ref<HTMLDialogElement>();


function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
}

const newDeckName = ref<string>('');

function showNewDeckDialog() {
    isMenuOpen.value = false;
    newDeckName.value = '';
    newDeckDialog.value?.showModal();
}

function addNewDeck() {
    newDeckDialog.value?.close();
    const id = store.addDeck(newDeckName.value);
    newDeckName.value = '';
    router.push({ name: 'deck', params: { id } })
}
</script>

<style scoped>
.decks-view {
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
}

.decks {
    padding: 1rem;
    overflow: auto;
    flex-grow: 1;
}

.menu {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    text-align: right;
}

.toggle {
    margin-left: auto;
    background-color: var(--c-gold);
    border-radius: 1rem;
    border: none;
    width: 4rem;
    aspect-ratio: 1;
    display: grid;
    justify-content: center;
    align-items: center;

    .toggle__icon {
        color: var(--c-tab-icon);
        width: 1.5rem;
        height: 1.5rem;
        background-color: currentColor;
        mask-repeat: no-repeat;
        mask-image: url('/images/menu.svg');
        mask-size: cover;
        mask-position: center;

        &.toggle__icon--close {
            mask-image: url('/images/close.svg');
        }
    }
}

.import-icon {
    color: var(--c-tab-icon);
    width: 1.5rem;
    height: 1.5rem;
    background-color: currentColor;
    mask-repeat: no-repeat;
    mask-image: url('/images/import.svg');
    mask-size: cover;
    mask-position: center;
}

.add-icon {
    color: var(--c-tab-icon);
    width: 1.5rem;
    height: 1.5rem;
    background-color: currentColor;
    mask-repeat: no-repeat;
    mask-image: url('/images/add.svg');
    mask-size: cover;
    mask-position: center;
}

.menu-items {
    display: grid;
    row-gap: 1rem;
    margin-bottom: 1rem;
}

.menu-item {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    column-gap: 1rem;

    span {
        background-color: var(--c-gold-dark);
        color: var(--c-gold-light);
        border-radius: 0.25rem;
        padding-block: 0.125rem;
        padding-inline: 0.5rem;
    }

    button {
        border-radius: 100vh;
        width: 2.5rem;
        aspect-ratio: 1;
        background-color: var(--c-gold-dark);
        border: none;
        display: grid;
        justify-content: center;
        align-items: center;
        color: var(--c-gold);
    }
}

.new-deck-dialog {
    label {
        display: blocK;
        color: white;
        margin-bottom: 0.25rem;
    }

    input {
        color: white;
        width: 100%;
        border-radius: 100vh;
        padding-block: 0.5rem;
        padding-inline: 1rem;
        background-color: #333;
        border: none;
    }
}
</style>