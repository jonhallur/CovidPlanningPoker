<script>
    import Icon from 'svelte-awesome';
    export let action;
    export let text;
    export let disabled;
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