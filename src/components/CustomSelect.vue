<template>
    <div class="custom-select">
        <select v-model="model">
            <slot></slot>
        </select>
    </div>
</template>

<script setup lang="ts">
const model = defineModel();
</script>

<style scoped>
.custom-select {
    position: relative;
    display: block;

    select {
        appearance: none;
        width: 100%;
        padding: 0.5rem 2.5rem 0.5rem 1rem;
        background-color: hsl(0 0 20%);
        border: 1px solid hsl(0 0 40%);
        color: white;

        &:focus {
            outline: none;
        }
    }

    &::after {
        top: 50%;
        translate: 0 -50%;
        right: 0.5rem;
        position: absolute;
        content: '';
        display: block;
        width: 1.5rem;
        aspect-ratio: 1;
        pointer-events: none;

        background-color: hsl(0 0 60%);
        mask-repeat: no-repeat;
        mask-image: url('/images/chevron_forward.svg');
        mask-size: cover;
        mask-position: center;

        rotate: 90deg;
    }
}
</style>