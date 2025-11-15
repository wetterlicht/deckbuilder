<template>
    <label class="toggle" :for="checkboxId">
        <input :id="checkboxId" type="checkbox" v-model="modelValue">
        <div class="knob"></div>
        <div class="icon icon--off" :style="{
            maskImage: `url(${offIcon})`,
        }"></div>
        <div class="icon icon--on" :style="{
            maskImage: `url(${onIcon})`,
        }"></div>
    </label>
</template>

<script setup lang="ts">
const modelValue = defineModel<boolean>({ required: true })

const props = defineProps({
    checkboxId: {
        type: String,
        required: true
    },
    onIcon: {
        type: String,
        required: true
    },
    offIcon: {
        type: String,
        required: true
    }
})
</script>

<style scoped>
.toggle {
    position: relative;
    background: var(--c-gold);
    border-radius: 1rem;
    border: 1px solid var(--c-gold);
    width: 3.625rem;
    height: 2rem;
    box-sizing: content-box;
    position: relative;
    vertical-align: middle;
    transition: background 0.25s;
    cursor: pointer;

    input {
        appearance: none;
    }

    .knob {
        display: block;
        background-color: var(--c-indigo);
        border: 1px solid var(--c-indigo);
        border-radius: 50%;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
        width: 1.5rem;
        height: 1.5rem;
        position: absolute;
        top: 0.25rem;
        left: 0.25rem;
        transition: left 0.25s;
    }

    input:checked+.knob {
        top: 0.25rem;
        left: 1.875rem;
    }

    .icon {
        position: absolute;
        width: 1rem;
        height: 1rem;
        mask-repeat: no-repeat;

        mask-size: cover;
        mask-position: center;
        top: 50%;
        translate: 0 -50%;
        transition: background-color 0.25s;
    }

    .icon--off {
        background-color: var(--c-gold);
        left: 0.5rem;
    }

    .icon--on {
        background-color: var(--c-indigo);
        right: 0.5rem;
    }

    input:checked~.icon--off {
        background-color: var(--c-indigo);
    }

    input:checked~.icon--on {
        background-color: var(--c-gold);
    }
}
</style>