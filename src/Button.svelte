<script>
    import Icon from 'svelte-awesome';
    export let action = () => console.log("No action was set");
    export let text = "";
    export let disabled = false;
    export let icon;
</script>

<style>
    .button-container {
        margin: 0.3em;
        padding: 0.4em;
    }
    .button {
        padding: 0.5em;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
    }
    .button span {
        padding-right: 8px;
    }
    .button svg {
        margin: 8px;
    }
</style>

<div class="button-container">
    <button class="button" on:click|preventDefault="{action}" {disabled}>
        {#if text}
            <span>{text}</span>
        {/if}
        {#if icon}
            <Icon data="{icon}"/>
        {/if}
    </button>
</div>