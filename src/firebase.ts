import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCYiEV3F93YJlNmjnLsNInZMHnp9aF7MIs',
  authDomain: 'minigames-edf5b.firebaseapp.com',
  projectId: 'minigames-edf5b',
  storageBucket: 'minigames-edf5b.firebasestorage.app',
  messagingSenderId: '489173914806',
  appId: '1:489173914806:web:6402ecb92ffae77b10c217',
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
