<script lang="ts">
    import "$css/main.css";
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
            <tr>
                <td class="rank">1</td>
                <td class="player">
                    <p class="name"><a href="https://slippi.gg/user/lula-0">lula</a></p>
                    <p class="slippi">LULA#0 <span class="slash">/</span> kum sussy todd</p>
                </td>
                <td class="characters">fox</td>
                <td class="rating">1734.2 <img src="/ranks/gold-3.svg" class="tier" alt="Gold 3" title="Gold 3"/></td>
                <td class="wl"><span class="wins">23</span> <span class="slash">/</span> <span class="losses">17</span></td>
            </tr>
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
        width: 130px;
    }

    .wl {
        width: 80px;
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

    td.rating, td.wl {
        font-size: 18px;
        font-weight: 700;
        text-align: center;
    }

    .tier {
        display: inline-block;
        vertical-align: middle;
        padding-left: 8px;
        padding-bottom: 5px;
        height: 46px;
        width: 56px;
    }

    .wins { color: var(--color-green); }
    .losses { color: var(--color-red); }
</style>