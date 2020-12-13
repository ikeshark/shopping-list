import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { config } from "../firebaseConfig";

firebase.initializeApp(config);

// utils;
const db = firebase.firestore();
const auth = firebase.auth();

// collection references
const usersCollection = db.collection("users");
const householdsCollection = db.collection("households");

// export utils/refs
export { db, auth, usersCollection, householdsCollection };
