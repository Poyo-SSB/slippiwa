<script lang="ts">
    import "$css/main.css";
    import "$css/center.css";

    let code = "";
    let name = "";

    $: code = code.toUpperCase().replace(/[^A-Z0-9#]/, "");

    $: tagValid = /^[A-Z0-9]+#[0-9]+$/.test(code);
    $: nameValid = name.length > 0;

    function register() {
        fetch("/api/add", {
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({ code, name }),
            "method": "POST"
        });
    }
</script>

<div class="container">
    <div class="content">
        <h1>Register player</h1>
        <p>Please only register Washington players. Please?</p>
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
        <button disabled={!(tagValid && nameValid)} on:click={register}>Register</button>
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
        display: block;
        color: var(--color-foreground-dark);
        background-color: var(--color-background-lighter);
        padding: 8px 14px;
        margin: 10px auto 0;

        transition-property: color, background-color;
        transition-duration: 100ms;
    }

    button:disabled {
        color: var(--color-foreground-darkest);
        background-color: var(--color-background-light);
    }

    button:hover {
        color: var(--color-foreground-dark);
        background-color: var(--color-background-lightest);
    }

    button:active {
        color: var(--color-foreground-darker);
        background-color: var(--color-background-lighter);
    }
</style>