<script lang="ts">
    import type { Character } from "$ts/character";

    import { getSlugFromCharacter } from "$ts/character";

    const circumference = 2 * Math.PI * 18;

    export let character: Character;
    export let proportion: number;
    
    $: dashArray = proportion * circumference;

    $: percentage = (proportion * 100).toFixed(1) + "%";
</script>

<div class="container">
    <svg width="44" height="44" transform="scale(-1, 1)">
        <circle stroke="#50525A" stroke-width=4 fill="transparent" r=18 cx=22 cy=22></circle>
        <circle stroke="#2ECC40" stroke-width=4 fill="transparent" r=18 cx=22 cy=22 stroke-dasharray={`${dashArray} ${circumference - dashArray}`} stroke-dashoffset={circumference / 4}></circle>
    </svg>
    <img src="/characters/{getSlugFromCharacter(character)}.png" alt={character}>
    <div class="tooltip">{character} ({percentage})</div>
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

    .tooltip {
        white-space: nowrap;
        opacity: 0;
        transition-property: opacity;
        transition-duration: 100ms;
        pointer-events: none;
        font-family: "Maven Pro";
        font-size: 14px;
        line-height: 24px;
        position: absolute;
        z-index: 1;
        background-color: var(--color-background-lightest);
        height: 24px;
        margin: 0 auto;
        padding: 2px 9px;
        border-radius: 4px;
        transform: translateX(calc(-50% + 22px));
        user-select: none;
    }

    .container:hover > .tooltip {
        opacity: 1;
    }
</style>