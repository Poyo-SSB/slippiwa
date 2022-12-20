<script lang="ts">
    import "$css/main.css";
    import "$css/center.css";

    import { PUBLIC_CONTACT } from "$env/static/public";
    
    let code = "";
    let name = "";

    $: code = code.toUpperCase().replace(/[^A-Z0-9#]/, "");

    $: tagValid = /^[A-Z0-9]+#[0-9]+$/.test(code);
    $: nameValid = name.length > 0;

    let promise: Promise<Response> | null = null;
    let lastResult: any = null;

    async function register() {
        lastResult = null;

        promise = fetch("/api/add", {
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({ code, name }),
            "method": "POST"
        });

        const response = await promise;

        lastResult = await response.json();

        if (lastResult?.status === "success") {
            window.location.href = "/#" + lastResult.data.slug;
        }

        promise = null;
    }
</script>

<div class="container">
    <div class="content">
        <h1>Register player</h1>
        <p>Please only register Washington players. Please?</p>
        <p>Contact {PUBLIC_CONTACT} to have your name changed or to be removed.</p>
        <table>
            <tr>
                <td>Slippi code</td>
                <td><input bind:value={code} class:error={!tagValid} maxlength=9 placeholder="PLUB#754"/></td>
            </tr>
            <tr>
                <td>start.gg name</td>
                <td><input bind:value={name} class:error={!nameValid} maxlength=16 placeholder="Plup"/></td>
            </tr>
        </table>
        <p>
            <button disabled={!(tagValid && nameValid) || promise !== null} on:click={register}>{promise ? "· · ·" : "Register"}</button>
            {#if lastResult !== null}
                {#if lastResult?.status === "error"}
                    {lastResult.message}
                {:else if lastResult?.status === "success"}
                    Success!
                {:else}
                    Something truly terrible has happened. Please report this.
                {/if}
            {/if}
        </p>
    </div>
</div>

<svelte:head>
    <title>Register player</title>
</svelte:head>

<style>
    .container * {
        box-sizing: border-box;
    }
    
    table, input {
        width: 100%;
    }

    td {
        padding: 4px 6px;
    }

    td:first-child {
        text-align: right;
        width: 117px;
    }

    input, button {
        font-size: inherit;
        font-family: "Rubik";
        border: none;
        border-radius: 4px;
    }

    input {
        color: var(--color-foreground);
        background-color: var(--color-background-lighter);
        padding: 4px 8px;
    }

    input::placeholder {
        color: var(--color-foreground-darkest);
    }

    button {
        font-size: 1.1em;
        color: var(--color-foreground-dark);
        background-color: var(--color-background-lighter);
        width: 98px;
        padding: 8px 14px;
        margin-right: 8px;

        transition-property: color, background-color;
        transition-duration: 100ms;
    }

    button:hover {
        color: var(--color-foreground-dark);
        background-color: var(--color-background-lightest);
    }

    button:active {
        color: var(--color-foreground-darker);
        background-color: var(--color-background-lighter);
    }

    button:disabled {
        color: var(--color-foreground-darkest);
        background-color: var(--color-background-light);
    }
</style>