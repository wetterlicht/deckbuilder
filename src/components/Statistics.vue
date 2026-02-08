<template>
    <div class="statistics">
        <div class="ink-curve">
            <h2>Costs</h2>
            <div class="bars">
                <div v-for="(value, index) in inkCurve" :key="index" class="bar-wrapper">
                    <div class="count"><span :class="{ 'sr-only': value == 0 }">{{ value }}</span></div>
                    <div class="bar" :style="{ height: `${(value / maxValue) * 100}%` }"></div>
                </div>
            </div>
            <div class="labels">
                <div class="label" v-for="(value, index) in inkCurve" :key="index">{{ index === 7 ? '7+' : index }}
                </div>
            </div>
        </div>
        <div class="type-chart">
            <h2>Card Types</h2>

            <svg class="pie-svg" viewBox="0 0 100 100" role="img" aria-label="Card type distribution">
                <path v-for="slice in pieSlices" :key="slice.type" :d="slice.d" :fill="slice.color" stroke="white"
                    stroke-width="1" />
            </svg>

            <ul class="legend">
                <li v-for="slice in pieSlices" :key="slice.type">
                    <span class="dot" :style="{ background: slice.color }"></span>
                    {{ slice.type }} ({{ slice.count }})
                </li>
            </ul>
        </div>
        <div class="inkability-chart">
            <h2>Inkables</h2>

            <svg class="pie-svg" viewBox="0 0 100 100" role="img" aria-label="Inkable vs Uninkable cards">
                <path v-for="slice in inkabilitySlices" :key="slice.label" :d="slice.d" :fill="slice.color"
                    stroke="white" stroke-width="1" />
            </svg>

            <ul class="legend">
                <li v-for="slice in inkabilitySlices" :key="slice.label">
                    <span class="dot" :style="{ background: slice.color }"></span>
                    {{ slice.label }} ({{ slice.count }})
                </li>
            </ul>
        </div>
    </div>

</template>

<script setup lang="ts">
import type { DeckDataWithCards } from '@/types';
import { computed, type PropType } from 'vue';

const props = defineProps({
    deck: {
        type: Object as PropType<DeckDataWithCards>,
        required: true
    }
})

const inkCurve = computed(() => {
    const curve = Array(8).fill(0)

    for (const card of props.deck.cards) {
        const cost = card.data.cost
        const qty = card.quantity

        if (cost >= 7) {
            curve[7] += qty
        } else {
            curve[cost] += qty
        }
    }

    return curve
})

const maxValue = computed(() => Math.max(...inkCurve.value, 1))

const typeDistribution = computed(() => {
    const counts: Record<string, number> = {}

    for (const card of props.deck.cards) {
        for (const type of card.data.types) {
            counts[type] = (counts[type] ?? 0) + card.quantity
        }
    }

    return counts
})

const totalCards = computed(() =>
    Object.values(typeDistribution.value).reduce((a, b) => a + b, 0)
)

const typeColors: Record<string, string> = {
    Character: '#60a5fa',
    Action: '#f87171',
    Item: '#34d399',
    Song: '#fbbf24',
    Location: '#a78bfa'
}

const polarToCartesian = (
    cx: number,
    cy: number,
    r: number,
    angle: number
) => {
    const rad = (angle - 90) * Math.PI / 180
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad)
    }
}

const pieSlices = computed(() => {
    const slices = []
    let startAngle = 0
    const cx = 50
    const cy = 50
    const r = 48

    for (const [type, count] of Object.entries(typeDistribution.value)) {
        const angle = (count / totalCards.value) * 360
        const endAngle = startAngle + angle

        const start = polarToCartesian(cx, cy, r, startAngle)
        const end = polarToCartesian(cx, cy, r, endAngle)
        const largeArc = angle > 180 ? 1 : 0

        const d = [
            `M ${cx} ${cy}`,
            `L ${start.x} ${start.y}`,
            `A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
            'Z'
        ].join(' ')

        slices.push({
            type,
            count,
            d,
            color: typeColors[type] ?? '#9ca3af'
        })

        startAngle = endAngle
    }

    return slices
})

const inkabilityDistribution = computed(() => {
    let inkable = 0
    let uninkable = 0

    for (const card of props.deck.cards) {
        if (card.data.inkwell) {
            inkable += card.quantity
        } else {
            uninkable += card.quantity
        }
    }

    return {
        Inkable: inkable,
        Uninkable: uninkable
    }
})

const totalInkabilityCards = computed(() =>
    inkabilityDistribution.value.Inkable +
    inkabilityDistribution.value.Uninkable
)

const inkabilityColors: Record<string, string> = {
    Inkable: '#34d399',     // green
    Uninkable: '#f87171'    // red
}

const inkabilitySlices = computed(() => {
    const slices = []
    let startAngle = 0
    const cx = 50
    const cy = 50
    const r = 48

    for (const [label, count] of Object.entries(inkabilityDistribution.value)) {
        if (count === 0) continue

        const angle = (count / totalInkabilityCards.value) * 360
        const endAngle = startAngle + angle

        const start = polarToCartesian(cx, cy, r, startAngle)
        const end = polarToCartesian(cx, cy, r, endAngle)
        const largeArc = angle > 180 ? 1 : 0

        const d = [
            `M ${cx} ${cy}`,
            `L ${start.x} ${start.y}`,
            `A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
            'Z'
        ].join(' ')

        slices.push({
            label,
            count,
            d,
            color: inkabilityColors[label]
        })

        startAngle = endAngle
    }

    return slices
})
</script>

<style scoped>
.statistics {
    h2 {
        color: hsl(0, 0%, 85%);
        font-size: 0.75rem;
        font-weight: bold;
        text-transform: uppercase;
    }
}

.ink-curve {
    margin: 1rem;
    padding: 0.5rem;
    border: 1px solid hsl(0, 0%, 50%);
    border-radius: 0.5rem;
    background-color: hsl(236, 34%, 10%);
}

.bars {
    display: flex;
    align-items: flex-end;
    justify-content: space-evenly;
    gap: 0.25rem;
    height: 10rem;
    padding: 0.5rem 1rem 0 1rem;
}

.bar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    width: 1.5rem;
    height: 100%;
}

.bar {
    width: 100%;
    background: var(--c-gold);
    transition: height 0.25s ease;
}

.count {
    font-size: 0.75rem;
    color: white;
    font-weight: bold;
    padding-bottom: 0.25rem;
}

.labels {
    border-top: 1px solid hsl(0, 0%, 50%);
    display: flex;
    align-items: flex-end;
    justify-content: space-evenly;
    gap: 0.25rem;
    margin-inline: 1rem;
    padding-top: 0.25rem;
    padding-bottom: 0.5rem;
}

.label {
    width: 1.5rem;
    text-align: center;
    font-size: 0.75rem;
    color: white;
}


.type-chart {
    margin: 1rem;
    padding: 0.5rem;
    border: 1px solid hsl(0, 0%, 50%);
    border-radius: 0.5rem;
    background-color: hsl(236, 34%, 10%);
}

.pie-svg {
    width: 8rem;
    height: 8rem;
    display: block;
    margin: 0.5rem auto;
}

.legend {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0 0;
    font-size: 0.75rem;
    color: white;
}

.legend li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
}

.dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
}

.inkability-chart {
    margin: 1rem;
    padding: 0.5rem;
    border: 1px solid hsl(0, 0%, 50%);
    border-radius: 0.5rem;
    background-color: hsl(236, 34%, 10%);
}
</style>