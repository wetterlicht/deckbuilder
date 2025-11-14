<template>
    <div class="page-header">
        <div class="left">
            <slot name="left"></slot>
        </div>
        <div class="center">
            <slot name="default"></slot>
            <slot name="center-bottom"></slot>
        </div>
        <div class="right">
            <slot name="right"></slot>
        </div>
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
    grid-template-columns: 2rem 1fr 2rem;
    align-items: center;
    position: relative;
}

.center {
    font-size: 1.125rem;
    line-height: 1.5;
    text-align: center;
    color: white;
}
</style>