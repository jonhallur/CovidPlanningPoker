<script>
    import RoomView from './RoomView.svelte'
    import Button from './Button.svelte'
    import {joinRoom, removeKnownRoom} from './firebase'
    import {signIn, remove} from 'svelte-awesome/icons'
    import * as R from 'ramda'
    export let user;
    export let users;
    export let room;
    export let rooms;
</script>

<style>
    .main-layout {
        display: flex;
    }
    .list-of-rooms {
        max-width: 30%;
        min-width: 30%;
        width: 30%;
        margin: 0.2em;
        background-color: #fafafa;
        border-radius: 10px;
    }
    .room-line {
        display: flex;
        align-items: center;
        list-style-type: circle;
        justify-content: space-between;
    }
    .room-line p {
        margin: 0.4em;
        padding: 0.5em;
    }

    .current-room {
        max-width: 70%;
        min-width: 70%;
        width: 70%;
        margin: 0.2em;
        background-color: #fafafa;
        border-radius: 10px;
    }
    .button-column {
        display: flex;
        justify-content: flex-end;
    }
</style>

<div class="main-layout">
    <div class="list-of-rooms">
        {#if rooms.length > 0}
            <p>Your rooms</p>
            <ul>
                {#each rooms as {key, value}}
                    <li class="room-line">
                        <p>{value}</p>
                        <div class="button-column">
                            <Button text="Join" icon="{signIn}" action="{() => joinRoom(user.uid, key)}" disabled="{false}"/>
                            <Button text="" icon="{remove}" action="{() => removeKnownRoom(user.uid, key)}" disabled="{false}"/>
                        </div>
                    </li>
                {:else}
                    <p>No rooms</p>
                {/each}
            </ul>
        {:else}
            <p>You have no rooms</p>
        {/if}
    </div>

    <div class="current-room">
        {#if !R.isEmpty(room)}
            <RoomView room="{room}" users="{users}" user="{user}"/>
        {:else}
            <p>you are not in a room</p>
        {/if}
    </div>

</div>
