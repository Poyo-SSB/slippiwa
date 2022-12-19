<script lang="ts">
    import "$css/main.css";

    import Character from "$components/Character.svelte";

    import type { Player } from "$ts/types/player";

    import { getSlugFromTier } from "$ts/types/tier";

    import type { PageData } from "./$types";

    export let data: PageData;

    const players: Player[] = data.players;
</script>

<svelte:head>
    <title>Washington Slippi Leaderboard</title>
</svelte:head>

<div class="container">
    <!-- svelte-ignore a11y-missing-attribute -->
    <h1><img src="/flag.svg" class="flag"/>Washington Slippi Leaderboard</h1>

    <table>
        <thead>
            <tr>
                <th class="rank">Rank</th>
                <th class="player">Player</th>
                <th class="characters">Characters</th>
                <th class="rating">Rating</th>
                <th class="wl">W / L</th>
            </tr>
        </thead>
        <tbody>
            {#each players as player, i}
                <tr>
                    <td class="rank">{i + 1}</td>
                    <td class="player">
                        <p class="name"><a href="https://slippi.gg/user/{player.slippiTag.toLowerCase()}-{player.slippiDiscriminator}">{player.name}</a></p>
                        <p class="slippi">
                            {player.slippiTag}#{player.slippiDiscriminator}
                            <span class="slash">/</span>
                            {player.slippiName}
                        </p>
                    </td>
                    <td class="characters">
                        {#each player.characters.slice(0, 3) as character}
                            <Character character={character.character} proportion={character.proportion}/>{" "} <!-- lmao??? -->
                        {/each}
                        {#if player.characters.length > 3}
                            <div class="extra">+{player.characters.length - 3}</div>
                        {/if}
                    </td>
                    <td class="rating">
                        {player.rating?.toFixed(1) ?? "⸻"}
                        <img src="/ranks/{getSlugFromTier(player.tier)}.svg" class="tier" alt="{player.tier}" title="{player.tier}"/>
                    </td>
                    <td class="wl"><span class="wins">{player.wins ?? "⸺"}</span> <span class="slash">/</span> <span class="losses">{player.losses ?? "⸺"}</span></td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .container {
        max-width: 900px;
        margin: 0 auto;
    }

    .flag {
        display: inline-block;
        vertical-align: middle;
        height: 0.7em;
        border-radius: 3px;
        margin: 0 0.3em;
        margin-bottom: 0.13em;
    }

    h1 {
        font-size: 2.6em;
        line-height: 1em;
        text-align: center;
    }

    table {
        width: 100%;
        background-color: var(--color-background-light);
        border-radius: 4px;
        table-layout: fixed;
        border-collapse: collapse;
    }

    th {
        color: var(--color-foreground-darkest);
        font-family: "Maven Pro";
        font-weight: 500;
        text-align: left;
        text-transform: uppercase;
    }

    th, td {
        padding: 6px 16px;
        line-height: 1.5;
    }

    tr {
        border-collapse: separate;
        border-bottom: 1px solid var(--color-background);
    }

    tbody tr:last-child {
        border-bottom: none;
    }

    a:link {
        color: var(--color-foreground);
        text-decoration: none;
    }

    a:visited {
        color: var(--color-foreground);
    }

    a:hover, a:focus {
        color: var(--color-foreground-dark);
    }

    /* column widths */

    .rank {
        width: 50px;
    }

    .rating {
        width: 140px;
    }

    .wl {
        width: 80px;
    }

    .characters {
        width: 190px;
    }

    /* column styles */

    th.rank, th.rating, th.wl {
        text-align: center;
    }

    td.rank {
        font-size: 22px;
        font-weight: 700;
        text-align: center;
    }

    td.player > p {
        margin: 0;
    }

    .name {
        font-size: 18px;
        font-weight: 700;
    }

    .slippi {
        color: var(--color-foreground-darker);
        font-size: 12px;
    }

    .slash { color: var(--color-foreground-darkest); }

    .extra {
        font-size: 1.1em;
        font-weight: 500;
        color: var(--color-foreground-darkest);
        display: inline-block;
        padding-left: 2px;
        width: 44px;
        height: 44px;
        line-height: 44px;
        vertical-align: top;
    }

    td.rating, td.wl {
        font-size: 18px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        text-align: center;
    }

    .tier {
        display: inline-block;
        vertical-align: middle;
        margin-left: 8px;
        margin-bottom: 5px;
        height: 46px;
        width: 56px;
    }

    .wins { color: var(--color-green); }
    .losses { color: var(--color-red); }
</style>