<script>
    import * as R from 'ramda'
    import {objectToArray, leaveRoom, kickUserFromRoom} from './firebase'
    import {signOut} from 'svelte-awesome/icons'
    import Button from './Button.svelte'
    import CardSelector from "./CardSelector.svelte";
    import Card from "./Card.svelte";

    export let room;
    export let user;
    export let users;
    let roomUsers = [];
    let selected;
    let showCards = false;
    $: {
        if(!R.isEmpty(room)) {
            let userId = user.uid;
            let usersObject = R.propOr([], 'users', room);
            if(!R.isEmpty(usersObject)) {
                selected = R.propOr(false, 'selected', usersObject[userId]);
                if (!R.isEmpty(users)) {
                    let usersWithName = R.mapObjIndexed((value, key) => {
                        let name = users[key].name;
                        return {...value, name: name, key:key}
                    })(usersObject);
                    roomUsers = objectToArray(usersWithName);
                    showCards = R.all(R.pathEq(['value', 'show'], true), roomUsers)
                }
            }
        }
    }
</script>

<style>
    .players-container {
        display: flex;
        justify-content: space-between;
    }
    .card-holder {
        display: flex;
    }

    .player {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        border-radius: 5px;
        background-color: white;
        margin: 0.5em;
        padding: 0.4em;
    }
</style>

<div>Current room: {room.name} - Invite code: {room.hash}</div><Button text="Leave room" icon="{signOut}" action="{() => leaveRoom(user.uid)}" />
<div class="players-container">
    {#each roomUsers as {key, value}}
    <div class="player">
        {#if user.uid === room.owner}
            <Button text="Kick" icon="{signOut}" action={() => kickUserFromRoom(value.key)} />
        {/if}
        <h5>{value.name}</h5>
        <div class="card-holder">
            <Card card="{value.selected}" selected="{value.show}" show={showCards}/>
        </div>
    </div>
    {/each}
</div>
<h1>Your cards</h1>
<CardSelector room="{room}" user="{user}" selected="{selected}"/>

