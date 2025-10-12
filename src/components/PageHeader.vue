<template>
    <div class="page-header">
        <slot name="left"></slot>
        <h1>
            <slot name="default"></slot>
        </h1>
        <slot name="right"></slot>
    </div>

</template>

<script setup lang="ts">
</script>

<style scoped>
.page-header {
    margin-top: 0;
    padding-inline: 1rem;
    padding-block: 1rem;
    background-color: black;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    position: relative;
}

h1 {
    position: absolute;
    left: 50%;
    translate: -50%;
    font-size: 1.125rem;
    line-height: 1.5;
    text-align: center;
    color: white;
}
</style>