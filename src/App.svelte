<script>
	import Notifications from 'svelte-notifications';
	import TopBanner from './TopBanner.svelte'
	import MainView from "./MainView.svelte";
	import {authUser, db, objectToArray} from './firebase'
	import { writable } from 'svelte/store'
	import * as R from 'ramda'
	let currentRoomState = writable({});
	let rooms = writable([]);
	let users = writable([]);

	authUser.subscribe(async (userData) => {
		let uid = userData.uid;
		let usersRef = db.ref('users');
		let userRef = usersRef.child(uid);
		let user = await userRef.once('value');
		if (!user.val()) {
			userRef.update({
				name: userData.displayName,
				email: userData.email,
			})

		}
		usersRef.on('value', function (snapshot) {
			if(snapshot.val()) {
				users.set(snapshot.val());
			}
		});

		userRef.child('knownRooms').on('value', function (snapshot) {
			let roomsObject = snapshot.val();
			if (roomsObject) {
				let roomList = objectToArray(roomsObject);
				rooms.set(roomList);
			} else {
				rooms.set([]);
			}

		});

		let lastRoomId;
		userRef.child('currentRoom').on('value', function (snapshot) {
			let roomsRef = db.ref('rooms');
			if (lastRoomId)
				roomsRef.child(lastRoomId).child('users').off('value');
			let currentRoomId = snapshot.val();
			if (currentRoomId) {
				let currentRoomRef = db.ref('rooms').child(currentRoomId);
				currentRoomRef.on('value', function (snapshot) {
					let currentRoom = snapshot.val();
					if (currentRoom) {
						currentRoomState.set({key: currentRoomId, ...currentRoom});
					} else {
						currentRoomState.set({});
					}
				});
				lastRoomId = currentRoomId;
			} else {
				currentRoomState.set({})
			}
		});
	});

</script>

<Notifications>
	<main>
			<TopBanner user="{$authUser}"/>
			<MainView user="{$authUser}" room="{$currentRoomState}" rooms="{$rooms}" users="{$users}"/>
	</main>
</Notifications>


<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		font-size: 20px;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>