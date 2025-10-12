<template>
    <div class="card-details">
        <img :src="data.image_uris.digital.small" :alt="fullName">
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const data = {
    "id": "crd_cbc18e77d7ec4d50bf19650a9a559686",
    "name": "Elsa",
    "version": "Spirit of Winter",
    "layout": "normal",
    "released_at": "2023-08-18",
    "image_uris": {
        "digital": {
            "small": "https://cards.lorcast.io/card/digital/small/crd_cbc18e77d7ec4d50bf19650a9a559686.avif?1709690747",
            "normal": "https://cards.lorcast.io/card/digital/normal/crd_cbc18e77d7ec4d50bf19650a9a559686.avif?1709690747",
            "large": "https://cards.lorcast.io/card/digital/large/crd_cbc18e77d7ec4d50bf19650a9a559686.avif?1709690747"
        }
    },
    "cost": 8,
    "inkwell": false,
    "ink": "Amethyst",
    "type": ["Character"],
    "classifications": ["Floodborn", "Hero", "Queen", "Sorcerer"],
    "text": "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Elsa.)\nDEEP FREEZE When you play this character, exert up to 2 chosen characters. They can't ready at the start of their next turn.",
    "move_cost": null,
    "strength": 4,
    "willpower": 6,
    "lore": 3,
    "rarity": "Enchanted",
    "illustrators": ["Matthew Robert Davies"],
    "collector_number": "207",
    "lang": "en",
    "flavor_text": null,
    "tcgplayer_id": 510153,
    "legalities": {
        "core": "legal"
    },
    "set": {
        "id": "set_7ecb0e0c71af496a9e0110e23824e0a5",
        "code": "1",
        "name": "The First Chapter"
    },
    "prices": {
        "usd": null,
        "usd_foil": 1267.58
    }
}

const fullName = computed(() => data.name + ", " + data.version)
</script>

<style scoped>
.card-details {
    background-color: black;
}
</style>