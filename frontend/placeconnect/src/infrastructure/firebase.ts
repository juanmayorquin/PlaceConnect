import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAu70T1H2KrxF1Dkeu9AlizyKKAa__mdho",
  authDomain: "placeconnect.firebaseapp.com",
  projectId: "placeconnect",
  storageBucket: "placeconnect.firebasestorage.app",
  messagingSenderId: "1007903489412",
  appId: "1:1007903489412:web:ba3560dfd88378cee671d1"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
