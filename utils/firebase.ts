import { initializeApp } from "firebase/app";

import { getStorage, ref as storageRef } from "firebase/storage";

// used for the firestore refs
const storage = getStorage(
  initializeApp({
    apiKey: "AIzaSyC6Z_k34_KmcE8fsCND_5B42Ft1S4zFtfw",
    authDomain: "woulouj-31f13.firebaseapp.com",
    projectId: "woulouj-31f13",
    storageBucket: "woulouj-31f13.appspot.com",
    messagingSenderId: "888543354191",
    appId: "1:888543354191:web:0482e3976022ad370b793a",
    measurementId: "G-KLBK5GSYD0",
  })
);

export const getRef = (name: string) => {
  return storageRef(storage, name);
};
