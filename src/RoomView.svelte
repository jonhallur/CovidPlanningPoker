<script>
    import * as R from 'ramda'
    import {objectToArray, leaveRoom} from './firebase'
    import {signOut} from 'svelte-awesome/icons'
    import Button from './Button.svelte'
    import CardSelector from "./CardSelector.svelte";
    import Card from "./Card.svelte";

    export let room;
    export let user;
    export let users;
    let roomUsers = [];
    let selected;
    $: {
        if(!R.isEmpty(room)) {
            let userId = user.uid;
            let userObj = R.propOr([], 'users', room);
            if(!R.isEmpty(userObj)) {
                selected = R.propOr(false, 'selected', userObj[userId]);
                if (!R.isEmpty(users)) {
                    let usersWithName = R.mapObjIndexed((value, key) => {
                        let name = users[key].name;
                        return {...value, name: name}
                    })(userObj);
                    roomUsers = objectToArray(usersWithName);
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
        <h5>{value.name}</h5>
        <div class="card-holder">
            <Card selected="{false}" card="{value.selected}" show="{value.show}"/>
        </div>
    </div>
    {/each}
</div>
<h1>Your cards</h1>
<CardSelector room="{room}" user="{user}" selected="{selected}"/>

