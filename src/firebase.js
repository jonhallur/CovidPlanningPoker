import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { authState } from 'rxfire/auth';
import * as R from 'ramda';
import Hashids from 'hashids';
const hashids = new Hashids("CovidPlanningPokerSalt");
import { getNotificationsContext } from 'svelte-notifications';

const firebaseConfig = {
  apiKey: "AIzaSyAjdeBhdVYcqEIskOg3-U1L2zqyXKNU4yI",
  authDomain: "covid-planning-poker.firebaseapp.com",
  databaseURL: "https://covid-planning-poker.firebaseio.com",
  projectId: "covid-planning-poker",
  storageBucket: "covid-planning-poker.appspot.com",
  messagingSenderId: "535144385181",
  appId: "1:535144385181:web:e4c04a12e0d9c01330a274"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
export const db = firebase.database();
export let authUser = authState(auth);

export const googleSignIn = () => auth.signInWithPopup(googleProvider);
export const googleSignOut = () => auth.signOut();
export const objectToArray = R.pipe(R.toPairs, R.map(R.zipObj(['key', 'value'])));

export const setCurrentRoom = async (userId, roomId) => {
  let userRef = db.ref('users').child(userId);
  return userRef.update({currentRoom: roomId})
};


export const leaveRoom = async(userId) => {
  let currentRoomKey = getCurrentRoomKey(userId)
  if(currentRoomKey) {
    await kickUserFromRoom(userId);
    let currentRoomRef = db.ref('users').child(userId).child('currentRoom');
    return await currentRoomRef.set("");
  }
};

const getCurrentRoomKey = async (userId) => {
  let currentRoomRef = db.ref('users').child(userId).child('currentRoom');
  let currentRoomSnap = await currentRoomRef.once('value');
  return currentRoomSnap.val();
}

export const kickUserFromRoom = async (userId) => {
  console.log("kick", userId)
  let roomKey = await getCurrentRoomKey(userId);
  if(roomKey) {
    let userInRoomRef = db.ref('rooms').child(roomKey).child('users').child(userId);
    return await userInRoomRef.remove();
  }
}

export const joinRoom = async (userId, roomId) => {
  console.log("join", userId, roomId)
  await leaveRoom(userId);
  let roomsRef = db.ref('rooms');
  let roomToJoinRef = roomsRef.child(roomId);
  let roomToJoin = await roomToJoinRef.once('value');
  if(roomToJoin.exists()) {
    let thisRoomRef = roomToJoinRef.child('users').child(userId);
    await thisRoomRef.set({
      selected: '1',
      show: false
    });
    await setCurrentRoom(userId, roomId);
    await addKnownRoom(userId, roomId, roomToJoin.val().name);
  }
  else {
    let allRooms = await roomsRef.orderByChild("hash").once('value');
    let rooms = R.values(allRooms.val());
    let roomIndex = R.findIndex(R.propEq('hash', roomId), rooms);
    if (roomIndex === -1) {
      const {addNotification} = getNotificationsContext();
      addNotification({
        text: `Room ${roomId} was not found.`,
        position: 'top-right',
        type: 'error',
        removeAfter: 4000
      })
    } else {
      let roomIdFromHash = R.keys(allRooms.val())[roomIndex];
      let roomToJoin = await roomsRef.child(roomIdFromHash).once('value');
      let thisRoomRef = roomsRef.child(roomIdFromHash).child('users').child(userId);
      await thisRoomRef.set({
        selected: '1',
        show: false
      });
      await setCurrentRoom(userId, roomIdFromHash);
      await addKnownRoom(userId, roomIdFromHash, roomToJoin.val().name);
    }
  }
};

const addKnownRoom = async (userId, roomKey, roomName) => {
  console.log("akr", userId, roomKey, roomName)
  let knownRoomsRef = db.ref('users').child(userId).child('knownRooms');
  let roomsSnapshot = await knownRoomsRef.once('value');
  let rooms = roomsSnapshot.val();
  if(rooms) {
    if(!R.has(roomKey, rooms))
       return knownRoomsRef.update({[roomKey]: roomName});
  } else {
    return knownRoomsRef.set({[roomKey]: roomName})
  }
};

export const createRoom = async (userId, roomName) => {
  let roomsRef = db.ref('rooms');
  let roomsSnapshot = await roomsRef.once('value');
  let rooms = roomsSnapshot.val();
  let count = R.keys(rooms).length;
  let hash = hashids.encode(count);
  let newRoomSnap = await roomsRef.push({
    name: roomName,
    owner: userId,
    hash: hash,
  });
  if(newRoomSnap) {
    let newRoomKey = newRoomSnap.key;
    let thisRoomRef = roomsRef.child(newRoomKey).child('users').child(userId);
    let userStateInRoom = await thisRoomRef.set({
      selected: '1',
      show: false
    });
    setCurrentRoom(userId, newRoomKey);
    addKnownRoom(userId, newRoomKey, roomName)
  }
  return newRoomSnap;
};

export const removeKnownRoom = async (userId, roomId) => {
  let knownRoomsRef = db.ref('users').child(userId).child('knownRooms').child(roomId);
  return knownRoomsRef.remove();
};