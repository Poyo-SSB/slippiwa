<script lang="ts">
    import "$css/main.css";

    import { page } from "$app/stores";

    const map: Record<number, string> = {
        404: "Take me back to the leaderboard!"
    };
</script>

<div class="container">
    <div class="content">
        <h1>Error {$page.status}: {$page.error?.message}</h1>
        <p><a href="/">{map[$page.status]}</a></p>
    </div>
</div>

<style>
    :global(html, body), .container {
        width: 100%;
        height: 100%;
    }

    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
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