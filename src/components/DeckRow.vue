<template>
    <li class="deck-row">
        <RouterLink :to="to">
            <div class="inks">
                <img v-for="ink in deck.inks" :src="`/images/${ink.toLowerCase()}.svg`" :alt="ink">
            </div>
            <div class="name">{{ deck.name }}</div>
        </RouterLink>
        <button class="context-menu-button" @click="showContextMenuDialog"></button>

        <dialog ref="contextMenuDialog" class="base-dialog context-menu-dialog" closedby="any">
            <div class="context-menu__buttons">
                <h2>{{ deck.name }}</h2>
                <button class="button button--edit" type="button" @click="showEditDeckDialog">Edit</button>
                <button class="button button--delete" type="button" @click="showDeleteDeckDialog">Delete</button>
                <div class="collection-toggle">
                    <label :for="`collection-tracking-${deck.id}`">Use collection</label>
                    <Toggle :checkboxId="`collection-tracking-${deck.id}`" :modelValue="deck.usesCollectionTracking"
                        @update:modelValue="setCollectionTracking" onIcon="/images/collection.svg" offIcon="">
                    </Toggle>

                </div>
            </div>
        </dialog>

        <dialog ref="editDeckDialog" class="base-dialog edit-deck-dialog">
            <form @submit.prevent="editDeck">
                <label for="deck-name">Name</label>
                <input type="text" id="deck-name" v-model="deckName" required>
                <div class="buttons"><button class="action-button action-button--secondary" type="button"
                        @click="editDeckDialog?.close()">Cancel</button><button class="action-button"
                        type="submit">Save</button>
                </div>
            </form>
        </dialog>

        <dialog ref="deleteDeckDialog" class="base-dialog">
            <form @submit.prevent="deleteDeck">
                <p>Are you sure you want to delete the deck <strong>{{ deck.name }}</strong>?</p>
                <div class="buttons"><button class="action-button action-button--secondary" type="button"
                        @click="deleteDeckDialog?.close()">Cancel</button><button class="action-button"
                        type="submit">Delete</button>
                </div>
            </form>
        </dialog>
    </li>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import type { DeckDataWithCards } from '@/types';
import { computed, ref, type PropType } from 'vue';
import { RouterLink } from 'vue-router';
import Toggle from './Toggle.vue';

const props = defineProps({
    deck: {
        type: Object as PropType<DeckDataWithCards>,
        required: true
    }
})

const store = useMainStore();

const contextMenuDialog = ref<HTMLDialogElement>();
const editDeckDialog = ref<HTMLDialogElement>();
const deleteDeckDialog = ref<HTMLDialogElement>();
const deckName = ref<string>(props.deck.name);

function showContextMenuDialog() {
    contextMenuDialog.value?.showModal();

}

function showEditDeckDialog() {
    contextMenuDialog.value?.close();
    editDeckDialog.value?.showModal();
}

function editDeck() {
    store.renameDeck(props.deck.id, deckName.value)
    editDeckDialog.value?.close();
}

function showDeleteDeckDialog() {
    contextMenuDialog.value?.close();
    deleteDeckDialog.value?.showModal();
}

function deleteDeck() {
    store.deleteDeck(props.deck.id);
    deleteDeckDialog.value?.close();
}

function setCollectionTracking(value: boolean) {
    console.log("setCollectionTracking", props.deck.id)
    store.setCollectionTrackingForDeck(props.deck.id, value);
}

const to = computed(() => {
    return {
        name: 'deck',
        params: { id: props.deck.id }
    }
})
</script>

<style scoped>
.deck-row {
    color: white;
    border-top: 2px solid var(--c-gold);
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;

    &:last-child {
        border-bottom: 2px solid var(--c-gold);
    }

}

.deck-row a {
    padding-block: 0.75rem;
    padding-inline: 0.75rem;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    column-gap: 0.5rem;
    text-decoration: none;
    color: white;
}

.inks {
    display: flex;
    align-items: center;
    gap: 0.125rem;

    img {
        height: 2rem;
    }
}

.context-menu-button {
    height: 1.5rem;
    width: 1.5rem;
    color: white;
    background-color: currentColor;
    mask-repeat: no-repeat;
    mask-image: url('/images/context_menu.svg');
    mask-size: cover;
    mask-position: center;
}

.context-menu-dialog {
    width: 100%;

    h2 {
        color: white;
        font-size: 1.125rem;
    }

    .context-menu__buttons {
        display: grid;
        row-gap: 0.5rem;

        .button {
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: center;
            column-gap: 0.5rem;
            background: none;
            font-weight: bold;
            color: white;
            border: none;
            text-align: left;
            width: 100%;
            padding-inline: 0;
            padding-block: 0.5rem;

            &::before {
                content: '';
                height: 1.5rem;
                width: 1.5rem;
                background-color: currentColor;
                mask-repeat: no-repeat;
                mask-size: cover;
                mask-position: center;
            }

            &.button--edit::before {
                mask-image: url('/images/edit.svg');
            }

            &.button--delete::before {
                mask-image: url('/images/trash.svg');
            }
        }
    }
}

.collection-toggle {
    display: flex;
    align-items: center;
    column-gap: 1rem;
    font-weight: bold;
    justify-content: space-between;
}

.edit-deck-dialog {
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