import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUrwKb7ZdlY5y0T24D0tUICfA87xaue2w",
  authDomain: "sweetbakery-725cd.firebaseapp.com",
  projectId: "sweetbakery-725cd",
  storageBucket: "sweetbakery-725cd.appspot.com",
  messagingSenderId: "589900273192",
  appId: "1:589900273192:web:a02ed9149771a653b7071d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);

export { storage, auth };
