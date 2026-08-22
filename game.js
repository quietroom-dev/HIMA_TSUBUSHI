// 正解ワード
const correctWords = [
    "暇",
    "ひま",
    "暇ー！",
    "ひま〜",
    "ヒマ",
    "ひまだな〜"
];


// 間違いワードと終了コメント
const wrongWords = {

    "宿題": "宿題を忘れて怒られた…",

    "ごはん": "お腹が空いた…",

    "仕事": "クビになった…",

    "勉強": "バカになった…",

    "掃除": "ゴミ屋敷になった…",

    "目": "失明…",

    "悪": "世界は平和になり、再び暇になった…",

    "ヒヒ": "動物愛護団体から訴えられた…",

    "しま": "日本列『島』が沈没した…"

};


let score = 0;

let isPlaying = false;

let spawnDelay = 900;


// DOM
const titleScreen =
    document.getElementById("title-screen");

const gameArea =
    document.getElementById("game-area");

const rankingArea =
    document.getElementById("ranking-area");

const startButton =
    document.getElementById("title-start-btn");

const rankingListTitle =
    document.getElementById("ranking-list");

const rankingListGameover =
    document.getElementById("ranking-list-gameover");

const gameOverRanking =
    document.getElementById("world-ranking-list-gameover");

const scoreDisplay =
    document.getElementById("score");

const gameOverScreen =
    document.getElementById("game-over");

const gameOverMessage =
    document.getElementById("game-over-message");

const restartButton =
    document.getElementById("restart-btn");


// ボタン
startButton.addEventListener(
    "click",
    startGame
);

restartButton.addEventListener(
    "click",
    startGame
);


/*
 * 自己ベスト読み込み
 */
function loadRanking() {

    const data =
        JSON.parse(
            localStorage.getItem("ranking")
        ) || [];


    rankingListTitle.innerHTML = "";


    data.forEach((item, index) => {

        const li =
            document.createElement("li");

        li.textContent =
            `${index + 1}位：${item}点`;

        rankingListTitle.appendChild(li);

    });


    rankingListGameover.innerHTML = "";


    data.forEach((item, index) => {

        const li =
            document.createElement("li");

        li.textContent =
            `${index + 1}位：${item}点`;

        rankingListGameover.appendChild(li);

    });

}


/*
 * 自己ベスト保存
 */
function saveRanking(newScore) {

    let data =
        JSON.parse(
            localStorage.getItem("ranking")
        ) || [];


    data.push(newScore);


    data.sort(
        (a, b) => b - a
    );


    data =
        data.slice(0, 5);


    localStorage.setItem(
        "ranking",
        JSON.stringify(data)
    );

}


/*
 * Firebase準備後にランキングを読み込む
 */
async function initializeWorldRanking() {

    if (
        typeof window.loadWorldRanking ===
        "function"
    ) {

        await window.loadWorldRanking();

    }

}


/*
 * Firebaseが先に準備できた場合
 */
if (
    typeof window.loadWorldRanking ===
    "function"
) {

    initializeWorldRanking();

}


/*
 * Firebaseが後から準備できた場合
 */
window.addEventListener(
    "firebaseReady",
    initializeWorldRanking
);


/*
 * 初期ランキング
 */
loadRanking();


/*
 * ゲーム開始
 */
function startGame() {

    /*
     * 開始前ランキングを消す
     */
    rankingArea.classList.add("hidden");


    /*
     * 開始ボタンを消す
     */
    startButton.classList.add("hidden");


    /*
     * ゲームオーバーを消す
     */
    gameOverScreen.classList.add("hidden");


    /*
     * ゲームエリアを表示
     */
    gameArea.classList.remove("hidden");


    /*
     * スコア表示
     */
    scoreDisplay.classList.remove("hidden");


    score = 0;

    isPlaying = true;

    spawnDelay = 900;


    scoreDisplay.textContent =
        "スコア: " + score;


    /*
     * ゲームエリア内の「文字」だけ削除
     *
     * innerHTML = "" は使わない
     */
    document
        .querySelectorAll(".word")
        .forEach(word => word.remove());


    spawnWordLoop();

}


/*
 * 徐々に速くなるループ
 */
function spawnWordLoop() {

    if (!isPlaying) {
        return;
    }


    spawnWord();


    if (spawnDelay > 10) {

        spawnDelay -= 10;

    }


    setTimeout(
        spawnWordLoop,
        spawnDelay
    );

}


/*
 * 文字を出現させる
 */
function spawnWord() {

    if (!isPlaying) {
        return;
    }


    const wordElem =
        document.createElement("div");


    wordElem.classList.add("word");


    const rand =
        Math.random();


    let wordText;


    if (rand < 0.03) {

        wordText = "しま";

    }

    else if (rand < 0.7) {

        wordText =
            correctWords[
                Math.floor(
                    Math.random() *
                    correctWords.length
                )
            ];

    }

    else {

        const wrongKeys =
            Object.keys(wrongWords);


        wordText =
            wrongKeys[
                Math.floor(
                    Math.random() *
                    wrongKeys.length
                )
            ];

    }


    wordElem.textContent =
        wordText;


    /*
     * 重なり防止
     */
    let x;
    let y;

    let safe = false;

    let tries = 0;


    while (
        !safe &&
        tries < 100
    ) {

        x =
            Math.random() *
            (gameArea.clientWidth - 80);


        y =
            Math.random() *
            (gameArea.clientHeight - 160);


        safe = true;

        tries++;


        const existingWords =
            document.querySelectorAll(
                ".word"
            );


        existingWords.forEach(word => {

            const rect1 = {

                x: x,

                y: y,

                w: 80,

                h: 80

            };


            const rect2 = {

                x:
                    parseFloat(
                        word.style.left
                    ),

                y:
                    parseFloat(
                        word.style.top
                    ),

                w:
                    word.offsetWidth,

                h:
                    word.offsetHeight

            };


            if (

                rect1.x <
                rect2.x + rect2.w &&

                rect1.x + rect1.w >
                rect2.x &&

                rect1.y <
                rect2.y + rect2.h &&

                rect1.y + rect1.h >
                rect2.y

            ) {

                safe = false;

            }

        });

    }


    if (!safe) {

        x =
            Math.random() *
            (gameArea.clientWidth - 80);


        y =
            Math.random() *
            (gameArea.clientHeight - 160);

    }


    wordElem.style.left =
        x + "px";


    wordElem.style.top =
        y + "px";


    /*
     * クリック
     */
    wordElem.addEventListener(
        "click",
        () => {

            if (!isPlaying) {
                return;
            }


            if (
                correctWords.includes(
                    wordText
                )
            ) {

                score++;


                scoreDisplay.textContent =
                    "スコア: " + score;


                wordElem.remove();

            }

            else {

                endGame(wordText);

            }

        }
    );


    gameArea.appendChild(
        wordElem
    );


    /*
     * 3秒で消える
     */
    setTimeout(() => {

        if (wordElem.parentNode) {

            if (
                correctWords.includes(
                    wordText
                )
            ) {

                endGame("miss");

            }


            wordElem.remove();

        }

    }, 3000);

}


/*
 * ゲーム終了
 */
async function endGame(wrongWord) {

    isPlaying = false;


    let message;


    if (wrongWord === "miss") {

        message =
            "暇をつぶせなかった…";

    }

    else {

        const comment =
            wrongWords[wrongWord] ||
            "何か間違えた…";


        message =
            `${wrongWord}を潰した\n${comment}`;

    }


    /*
     * 自己ベスト保存
     */
    saveRanking(score);


    /*
     * 自己ベスト更新
     */
    loadRanking();


    /*
     * Firebaseへ保存
     */
    if (
        typeof window.saveWorldRanking ===
        "function"
    ) {

        try {

            await window.saveWorldRanking(
                score
            );

        }

        catch (error) {

            console.error(
                "世界ランキング保存エラー:",
                error
            );

        }

    }


    /*
     * 世界ランキング更新
     */
    if (
        typeof window.loadWorldRanking ===
        "function"
    ) {

        await window.loadWorldRanking();

    }


    /*
     * ゲームエリアの文字を消す
     */
    document
        .querySelectorAll(".word")
        .forEach(word => word.remove());


    /*
     * スコアを隠す
     */
    scoreDisplay.classList.add("hidden");


    /*
     * ゲームオーバー表示
     */
    gameOverMessage.textContent =
        `スコア: ${score}点\n${message}`;


    gameOverScreen.classList.remove(
        "hidden"
    );

}


/*
 * シェア
 */
function shareGame() {

    const shareData = {

        title:
            "暇つぶしゲーム",

        text:
            "このゲーム面白いよ！暇を潰せるよ！",

        url:
            location.href

    };


    if (navigator.share) {

        navigator
            .share(shareData)
            .catch(
                error =>
                    console.log(
                        "シェア失敗:",
                        error
                    )
            );

    }

    else {

        alert(
            "このブラウザはシェア機能に対応していません。\n" +
            "URLをコピーして紹介してください！"
        );

    }

}


document
    .getElementById("share-btn-gameover")
    ?.addEventListener(
        "click",
        shareGame
    );
