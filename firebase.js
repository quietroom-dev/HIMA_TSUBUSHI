import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    get
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";


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


/*
 * 世界ランキング保存
 */
window.saveWorldRanking = function(score) {

    return push(
        ref(db, "worldRanking"),
        score
    );

};


/*
 * 世界ランキング読み込み
 */
window.loadWorldRanking = async function() {

    try {

        const snapshot = await get(
            ref(db, "worldRanking")
        );

        const data = snapshot.val() || {};

        const scores = Object.values(data)
            .map(Number)
            .filter(score => !isNaN(score))
            .sort((a, b) => b - a)
            .slice(0, 5);


        const rankingHTML = scores
            .map((score, index) => {

                return `<li>${index + 1}位：${score}点</li>`;

            })
            .join("");


        const titleRanking =
            document.getElementById("world-ranking-list");

        const gameoverRanking =
            document.getElementById("world-ranking-list-gameover");


        if (titleRanking) {
            titleRanking.innerHTML =
                rankingHTML || "<li>まだ記録がありません</li>";
        }


        if (gameoverRanking) {
            gameoverRanking.innerHTML =
                rankingHTML || "<li>まだ記録がありません</li>";
        }


    } catch (error) {

        console.error(
            "世界ランキングの読み込みに失敗しました:",
            error
        );

    }

};


/*
 * Firebaseの準備完了をgame.jsへ通知
 */
window.dispatchEvent(
    new Event("firebaseReady")
);
