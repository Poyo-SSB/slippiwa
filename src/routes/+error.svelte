<script lang="ts">
    import { page } from "$app/stores";

    const map: Record<number, string> = {
        403: "no",
        404: "Take me back to the leaderboard!",
        500: "Uh oh!!! Please report this!!!!!!"
    };
</script>

<svelte:head>
    <title>Error {$page.status}</title>

    <style>
        /* this is in the head because anything elsewhere leaks into other pages for some reason */
        html, body {
            margin: 0;
            padding: 0;
            background-color: #0B120E;
            color: #EFF5F3;
            font-family: "Rubik";
        }

        html, body, .container {
            width: 100%;
            height: 100%;
        }

        .container {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        a:link {
            color: var(--color-foreground-darker);
        }

        a:visited {
            color: var(--color-foreground-darker);
        }

        a:hover, a:focus {
            color: var(--color-foreground-darkest);
        }
    </style>
</svelte:head>

<div class="container">
    <div class="content">
        <h1>Error {$page.status}: {$page.error?.message}</h1>
        <p><a href="/">{map[$page.status]}</a></p>
    </div>
</div>