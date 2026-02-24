import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCvJC_hBCE7-hJAuIa53qTVsdvKqRsHpTo",
    authDomain: "ecollector-59983.firebaseapp.com",
    databaseURL: "https://ecollector-59983-default-rtdb.firebaseio.com",
    projectId: "ecollector-59983",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);