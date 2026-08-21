import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyC8Lyx05eZPxIAgDBTrTlWGnDRdgNqYxgM",
    authDomain: "hima-tsubushi-1f104.firebaseapp.com",
    databaseURL: "https://hima-tsubushi-1f104-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "hima-tsubushi-1f104",
    storageBucket: "hima-tsubushi-1f104.appspot.com",
    messagingSenderId: "720746626169",
    appId: "1:720746626169:web:770e7674e981bd1e6e28a8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 保存
window.saveWorldRanking = function(score) {
    alert("loadWorldRanking 実行された");
    push(ref(db, "worldRanking"), score);
};

// 読み込み
window.loadWorldRanking = async function() {
    const snapshot = await get(ref(db, "worldRanking"));
    const data = snapshot.val() || {};

    const scores = Object.values(data)
        .sort((a, b) => b - a)
        .slice(0, 5);

    document.getElementById("world-ranking-list").innerHTML =
        scores.map((s, i) => `<li>${i+1}位：${s}点</li>`).join("");

    document.getElementById("world-ranking-list-gameover").innerHTML =
        scores.map((s, i) => `<li>${i+1}位：${s}点</li>`).join("");
};
