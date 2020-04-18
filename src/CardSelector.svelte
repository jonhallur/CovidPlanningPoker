<script>
    import Card from './Card.svelte'
    import Button from './Button.svelte'
    import {eye, eyeSlash} from 'svelte-awesome/icons'
    import * as R from 'ramda'
    import {db} from './firebase'
    export let user;
    export let room;
    export let selected;
    let cards = ['0', '1/2', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?', 'inf'];
    let currentCardShow = false;
    $: {
        if(!R.isNil(room) && !R.isNil(room.users))
            currentCardShow = R.propOr(false, 'show', room.users[user.uid]);
    }

    const onSelected = (card) => {
      let currentRoomUserRef = db.ref('rooms').child(room.key).child('users').child(user.uid);
      currentRoomUserRef.update({selected: card, show: false});
    };

    const onRevealToggle = () => {
        let currentRoomUserRef = db.ref('rooms').child(room.key).child('users').child(user.uid);
        currentRoomUserRef.update({show: !currentCardShow})
    };

</script>

<style>
    .card-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-content: flex-start;
    }
</style>

<div class="card-container">
    {#each cards as card}
        <Card card="{card}" selected="{selected === card}" show="{true}" onSelected="{onSelected}"/>
    {/each}
</div>
<Button icon="{currentCardShow ? eyeSlash : eye}" text="{currentCardShow ? 'Hide' : 'Reveal'}" disabled="{false}" action="{() => onRevealToggle()}"/>
