<script>
    import Button from './Button.svelte'
    import InputString from './InputString.svelte'
    import {googleSignIn, googleSignOut, joinRoom, createRoom} from './firebase'
    import { getNotificationsContext } from 'svelte-notifications';
    import { google, signIn, plusSquare } from 'svelte-awesome/icons';
    import * as R from 'ramda'
    export let user;
    const { addNotification } = getNotificationsContext();
    let authButtonText;
    let authButtonAction;
    let showJoinRoomInput = false;
    let showCreateRoomInput = false;
    let joinRoomId = '';
    let newRoomName = '';
    $: authButtonText = user ?  "Sign out" : "Sign in";
    $: authButtonAction = user ? googleSignOut : googleSignIn;
    $: showJoinRoomInput = user ? showJoinRoomInput : false;
    $: showCreateRoomInput = user ? showCreateRoomInput : false;
    const toggleJoinRoom = () => {
        showJoinRoomInput = !showJoinRoomInput;
        showCreateRoomInput = false;
    };
    const toggleCreateRoom = () => {
        showCreateRoomInput = !showCreateRoomInput;
        showJoinRoomInput = false;
    };
    const onJoinRoom = (roomId) => {
        showJoinRoomInput = false;
        if(R.isEmpty(roomId)) {
            return;
        }
        let joined = joinRoom(user.uid, roomId);
        joinRoomId = '';
    };
    const onCreateRoom = (roomName) => {
        showCreateRoomInput = false;
        if(R.isEmpty(roomName))
            return;
        let created = createRoom(user.uid, roomName);
        if(created) {
            addNotification({text: "Room created", position: 'top-right', type: 'success', removeAfter: 4000})
        }
        newRoomName = '';
    }
</script>

<style>
.top-banner {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

<div class="top-banner">
    <Button action="{() => authButtonAction()}" disabled="{false}" text="{authButtonText}" icon="{google}"/>
    <Button action="{() => toggleJoinRoom()}" text="Join room" disabled="{!user}" icon="{signIn}"/>
    {#if showJoinRoomInput}
        <InputString label="Room id" value="{joinRoomId}" onInputEnd="{onJoinRoom}"/>
    {/if}
    <Button action="{() => toggleCreateRoom()}" text="Create room" disabled="{!user}" icon="{plusSquare}"/>
    {#if showCreateRoomInput}
        <InputString label="Room name" value="{newRoomName}" onInputEnd="{onCreateRoom}"/>
    {/if}
</div>