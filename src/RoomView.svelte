<script>
    import * as R from 'ramda'
    import {objectToArray, leaveRoom, kickUserFromRoom} from './firebase'
    import {signOut, eye, eyeSlash} from 'svelte-awesome/icons'
    import Button from './Button.svelte'
    import CardSelector from "./CardSelector.svelte";
    import Card from "./Card.svelte";

    export let room;
    export let user;
    export let users;
    let roomUsers = [];
    let selected;
    let showCards = false;
    let showKicker = false;
    const removeLastName = (nameString) => {
        let nameList = R.split(' ', nameString);
        return R.join(' ', R.init(nameList));
    }
    $: {
        if(!R.isEmpty(room)) {
            let userId = user.uid;
            let usersObject = R.propOr([], 'users', room);
            if(!R.isEmpty(usersObject)) {
                selected = R.propOr(false, 'selected', usersObject[userId]);
                if (!R.isEmpty(users)) {
                    let usersWithName = R.mapObjIndexed((value, key) => {
                        let name = users[key].name;
                        return {...value, name: removeLastName(name), key:key}
                    })(usersObject);
                    roomUsers = objectToArray(usersWithName);
                    showCards = R.all(R.pathEq(['value', 'show'], true), roomUsers)
                }
            }
        }
    }

</script>

<style>
    .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-content: center;

    }
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
        margin: 0.5em;
        padding: 0.4em;
        background-color: #f0f0f0;
    }
    .player-name {
        margin: 10px 5px;
    }
</style>

<div class="row">
    <p>Current room: {room.name} - Invite code: {room.hash}</p>
    {#if user.uid === room.owner}
        <Button text="{showKicker ? 'Hide' : 'Show'} kicker" icon="{showKicker ? eyeSlash : eye}" action="{() => showKicker = !showKicker}" />
    {/if}
    <Button text="Leave room" icon="{signOut}" action="{() => leaveRoom(user.uid)}" />
</div>
<div class="players-container">
    {#each roomUsers as {key, value}}
    <div class="player">
        {#if user.uid === room.owner && showKicker}
            <Button text="Kick" icon="{signOut}" action={() => kickUserFromRoom(value.key)} />
        {/if}
        <p class="player-name">{value.name}</p>
        <div class="card-holder">
            <Card card="{value.selected}" selected="{value.show}" show={showCards} time={3000}/>
        </div>
    </div>
    {/each}
</div>
<h3>Your cards</h3>
<CardSelector room="{room}" user="{user}" selected="{selected}"/>

