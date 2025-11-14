<template>
    <div class="card-list">
        <ul @scroll="onGroupsScroll" v-if="groupBy">
            <li v-for="[groupValue, items] in cardGroupsSliced">
                <GroupHeader :groupBy="groupBy" :groupValue="groupValue" :count="getGroupCount(groupValue)">
                </GroupHeader>
                <ul v-if="items" class="cards" :ref="el => setGroupRef(groupValue, el)">
                    <CardRow v-for="entry in items" :card="entry.card" :quantity="entry.quantity"
                        @selected="() => showCardCarousel(entry.card.id)">
                    </CardRow>
                </ul>
            </li>
        </ul>
        <ul @scroll="onScroll" v-else>
            <CardRow v-for="entry in cardsWithQuantitiesSlice" :card="entry.card" :quantity="entry.quantity"
                @selected="() => showCardCarousel(entry.card.id)">
            </CardRow>
        </ul>
        <Transition name="slide-up-down">
            <CardCarousel v-if="isCarouselActive" :cardsWithQuantities="carouselCardsWithQuantites"
                v-model:index="carouselIndex" @close="hideCardCarousel">
            </CardCarousel>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import type { CardData, GroupBy, SortBy } from '@/types';
import CardRow from './CardRow.vue';
import { computed, nextTick, onMounted, ref, watch, type ComponentPublicInstance, type PropType } from 'vue';
import { useMainStore } from '@/stores/main';
import CardCarousel from './CardCarousel.vue';
import GroupHeader from './GroupHeader.vue';

const props = defineProps({
    cards: {
        type: Array<CardData>,
        required: true
    },
    groupBy: {
        type: String as PropType<GroupBy>,
        default: ''
    },
    sortBy: {
        type: String as PropType<SortBy>,
        default: ''
    }
})

const VISIBLE_STEP = 20;
const visibleCount = ref(VISIBLE_STEP);
const groupVisibleCount = ref<Record<string, number>>({});

const store = useMainStore();

watch(() => props.cards, () => {
    visibleCount.value = VISIBLE_STEP;
});

const groupRefs = ref<Record<string, HTMLElement | null>>({});

function setGroupRef(groupName: string, el: Element | ComponentPublicInstance | null) {
    groupRefs.value[groupName] = el instanceof HTMLElement ? el : null;
}

const cardGroups = computed(() => {
    const records = props.cards.map(card => ({
        quantity: store.getQuantity(card.id),
        card
    })).reduce((acc, cur) => {
        if (props.groupBy === 'type') {
            const type = cur.card.types[0] as string;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(cur);
        }

        if (props.groupBy === 'cost') {
            const cost = cur.card.cost as number;
            if (!acc[cost]) {
                acc[cost] = [];
            }
            acc[cost].push(cur);
        }

        if (props.groupBy === 'ink') {
            const inks = cur.card.inks.join(",");
            if (!acc[inks]) {
                acc[inks] = [];
            }
            acc[inks].push(cur);
        }

        if (props.groupBy === 'rarity') {
            const rarity = cur.card.rarity;
            if (!acc[rarity]) {
                acc[rarity] = [];
            }
            acc[rarity].push(cur);
        }

        return acc;
    }, {} as Record<string, Array<{ quantity: number, card: CardData }>>)
    return Object.entries(records).sort((a, b) => a[0].localeCompare(b[0]));
})

onMounted(() => {
    initializeGroupVisibleCounts(cardGroups.value);
})

watch(cardGroups, (groups) => {
    initializeGroupVisibleCounts(groups);
});

function getGroupCount(groupName: string): number {
    const group = cardGroups.value.find(group => group[0] === groupName);
    if (!group) {
        return 0;
    }
    return group[1].reduce((acc, cur) => acc + cur.quantity, 0);
}

function initializeGroupVisibleCounts(groups: Array<[string, Array<{ quantity: number, card: CardData }>]>) {
    groupVisibleCount.value = {};
    for (const [groupName, items] of groups) {
        groupVisibleCount.value[groupName] = VISIBLE_STEP;
    }
}

const cardGroupsSliced = computed(() => {
    return cardGroups.value.map(([groupName, items]) => {
        const count = groupVisibleCount.value[groupName] ?? VISIBLE_STEP;
        return [
            groupName,
            items.slice(0, count)
        ] as const;
    });
});

const cardsWithQuantities = computed(() => {
    return props.cards.map(card => ({
        quantity: store.getQuantity(card.id),
        card
    })).sort((a, b) => {
        if (props.sortBy === 'cost') {
            if (a.card.cost < b.card.cost) {
                return -1;
            }
            if (a.card.cost > b.card.cost) {
                return 1;
            }
        }

        if (a.card.name < b.card.name) {
            return -1;
        }
        if (a.card.name > b.card.name) {
            return 1;
        }

        return 0;
    })
})

const cardsWithQuantitiesSlice = computed(() => {
    return cardsWithQuantities.value.slice(0, visibleCount.value)
})

function loadMore() {
    if (visibleCount.value < store.filteredCards.length) {
        visibleCount.value += VISIBLE_STEP;
    }
}

function onScroll(event: Event) {
    const target = event.target as HTMLElement;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 100) {
        loadMore();
    }
}

function onGroupsScroll(event: Event) {
    const container = event.target as HTMLElement;

    for (const [groupName, items] of cardGroups.value) {
        const groupEl = groupRefs.value[groupName];
        if (!groupEl) continue;

        const rect = groupEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const distanceToBottom = containerRect.bottom - rect.bottom;

        if (distanceToBottom > -50 && distanceToBottom < 150) {
            loadMoreForGroup(groupName);
        }
    }
}

function loadMoreForGroup(groupName: string) {
    const currentCount = groupVisibleCount.value[groupName] as number;
    const totalCount = cardGroups.value.find(([name]) => name === groupName)?.[1].length as number;
    if (currentCount < totalCount) {
        groupVisibleCount.value[groupName] =
            currentCount + VISIBLE_STEP;
    }
}

const isCarouselActive = ref(false);

const carouselIndex = ref(0);

const carouselCardsWithQuantites = computed(() => {
    if (props.groupBy) {
        return Object.values(cardGroups.value).reduce((acc, cur) => {
            acc.push(...cur[1])
            return acc;
        }, [] as Array<{ quantity: number, card: CardData }>);
    } else {
        return cardsWithQuantities.value
    }
})

function showCardCarousel(cardId: string) {
    carouselIndex.value = carouselCardsWithQuantites.value.findIndex(entry => entry.card.id === cardId)
    isCarouselActive.value = true
}

function hideCardCarousel() {
    isCarouselActive.value = false

    nextTick(() => {
        const listEl = document.querySelector('.card-list')
        const cardEl = listEl?.querySelectorAll('.card-row')?.[carouselIndex.value]
        if (cardEl && cardEl instanceof HTMLElement) {
            cardEl.scrollIntoView({ behavior: 'auto', block: 'center' })
        }
        carouselIndex.value = 0;
    })
}

</script>

<style scoped>
.card-list {
    flex-grow: 1;
    overflow: hidden;

    ul {
        height: 100%;
        overflow: auto;
        padding-block: 0.125rem;
    }
}
</style>