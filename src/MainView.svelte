<script>
    import UserView from './UserView.svelte'
    export let user;
    export let users;
    export let room;
    export let rooms;

</script>
<style>

</style>

<div class="main-container">
    {#if user}
        <UserView user="{user}" room="{room}" rooms="{rooms}" users="{users}"/>
    {:else}
        <p>Not signed in</p>
    {/if}
</div>