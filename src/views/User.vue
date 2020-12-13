<template>
  <div class="wrapper p-4 pb-12 rounded-t-lg relative">
    <div v-if="!userEmail">
      <button
        class="text-xl p-2 ml-2 mb-2 mr-8"
        :class="isSignIn && ' bg-gray-800 text-white'"
        @click="isSignIn = true">Sign In</button>
      <button
        class="text-xl p-2 ml-2 mb-2 mr-8"
        :class="!isSignIn && ' bg-gray-800 text-white'"
          @click="isSignIn = false">Sign Up</button>

      <form v-on:submit.prevent="isSignIn ? signIn() : signUp()">
        <label class="block p-4 shadow-md border border-gray-400 mb-4">
          Email
          <input class="w-full p-2 border border-gray-300" v-model="email" type="text">
        </label>
        <label class="block p-4 shadow-md border border-gray-400 mb-4">
          Password
          <input class="w-full p-2 border border-gray-300" v-model="password" type="password">
        </label>
        <button type="submit" class="block p-2 px-8 shadow-lg mb-8 text-xl border-gray-600 border-2">
          {{ isSignIn ? 'Sign In' : 'Sign Up'}}
        </button>
      </form>
    </div>
    <div v-if="userEmail">
      <p class="text-2xl">{{ userEmail }} is logged in</p>
      <button class="block p-2 px-8 shadow-lg mb-8 text-xl border-gray-600 border-2" type="button" @click="signOut">
        Sign Out
      </button>
      <p>Your household: {{ houseName }}</p>
      <button class="block p-2 px-8 shadow-lg mb-8 text-xl border-gray-600 border-2" type="button" @click="createHouse">
        Create Household
      </button>
      <h2>Invite a user to your household</h2>
      <label class="block p-4 shadow-md border border-gray-400 mb-4">
        Email Address
        <input class="w-full p-2 border border-gray-300" type="text" v-model="inviteeEmail">
      </label>
      <button class="block p-2 px-8 shadow-lg mb-8 text-xl border-gray-600 border-2" type="button" @click="inviteUser">
        Invite User
      </button>
    </div>
  </div>
</template>

<script>
import * as firebase from "firebase/app";

import { mapState } from 'vuex';
import { auth, db, usersCollection, householdsCollection } from '../firebase';

export default {
  name: "User",
  data: function() {
    return {
      isSignIn: true,
      email: '',
      password: '',
      houseName: '',
      inviteeEmail: '',
      userEmail: auth.currentUser ?
        auth.currentUser.email : null
    }
  },
  computed: {
    ...mapState(["userProfile"])
  },
  created: function() {
    if (auth.currentUser) {
      console.log(auth.currentUser.uid)
      usersCollection.doc(auth.currentUser.uid).get()
      .then(doc => {
        console.log(doc)
        if (doc.exists) {
          console.log(doc.data())
          const household = doc.data().household;
          console.log(household)
          db.collection('households').doc(household).get()
          .then(myHouse => {
            if (myHouse.exists) {
              this.houseName = myHouse.data().name;
              console.log(this.houseName)
            }
          })
        }
      })
    }
  },
  methods: {
    signUp() {
      console.log('signup')
      auth.createUserWithEmailAndPassword(this.email, this.password)
      .then(({ user }) => {
        // this.$router.replace('/login')
        this.email = '';
        this.password = '';
        console.log(user.uid, user.email)

        // const newUser = { email:  }
        // db.collections('users')
        //   .doc(this.user.id)
      }).catch(err => {
        alert(err.message)
      });
    },
    signIn() {
      this.$store.dispatch('login', {
        email: this.email,
        password: this.password
      });
    },
    signOut() {
      auth.signOut().then(() => {
        this.userEmail = null
      }).catch(err => alert(err.message));
    },
    createHouse() {
      db.collection('households').add(
        { users: [auth.currentUser.uid] })
      .then(docRef => {
        usersCollection.doc(auth.currentUser.uid).set({
          households: docRef.id
        }, { merge: true });
      })
    },
    inviteUser() {
      usersCollection.where('email', '==', this.inviteeEmail)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const uid = doc.id;
            usersCollection.doc(uid).update({
              household: this.userProfile.household
            })
            householdsCollection.doc(this.userProfile.household).update({
              users: firebase.firestore.FieldValue.arrayUnion(uid)
            }).then(() => {
              this.inviteeEmail = '';
            })
          })
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>


<style lang="css" scoped>
  .wrapper {
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.5);
    margin: 0 auto 1rem auto;
    max-width: 666px;
    height: calc(100vh - 4rem);
  }
</style>
