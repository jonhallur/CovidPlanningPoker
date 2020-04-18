<script>
    export let card;
    export let selected;
    export let show;
    export let onSelected = () => { console.log("onSelected has not been set")};
</script>

<style>
    .card {
        margin: 10px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #f4f4f4;
    }
    .card-inner {
        display: flex;
        align-content: center;
        justify-content: space-around;
        width: 50px;
        height: 100px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: white;
    }
    .card-inner p {
        align-self: center;
    }
    .selected {
        background-color: cornflowerblue;
    }
</style>

<div class="card" class:selected="{selected}" on:click="{() => onSelected(card)}">
    <div class="card-inner">
        {#if show}
            <p>{card}</p>
        {:else}
            <p>#</p>
        {/if}
    </div>
</div>