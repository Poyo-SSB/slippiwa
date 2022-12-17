<script lang="ts">
    import type { Character } from "$ts/character";

    import { getSlugFromCharacter } from "$ts/character";

    const circumference = 2 * Math.PI * 18;

    export let character: Character;
    export let proportion: number;
    
    $: dashArray = proportion * circumference;
</script>

<div class="container">
    <svg width="44" height="44" transform="scale(-1, 1)">
        <circle stroke="#50525A" stroke-width=4 fill="transparent" r=18 cx=22 cy=22></circle>
        <circle stroke="#2ECC40" stroke-width=4 fill="transparent" r=18 cx=22 cy=22 stroke-dasharray={`${dashArray} ${circumference - dashArray}`} stroke-dashoffset={circumference / 4}></circle>
    </svg>
    <img src="/characters/{getSlugFromCharacter(character)}.png" alt={character}>
</div>
<style>
    .container {
        position: relative;
        display: inline-block;
        width: 44px; /* oh how i would love to not have to hardcode this... */
        height: 44px;
    }

    img {
        position: absolute;
        width: 22px;
        top: 11px;
        left: 11px;
    }
</style>