// 「暇」系の正解ワード
const correctWords = ["暇", "ひま", "暇ー！", "ひま〜", "ヒマ", "HIMA"];

// 間違いワードと終了コメント
const wrongWords = {
    "宿題": "宿題を忘れて怒られた…",
    "ごはん": "お腹が空いた…",
    "仕事": "仕事を思い出してしまった…",
    "勉強": "勉強しないといけない気がしてきた…",
    "掃除": "掃除をしろと言われた…"
};

let score = 0;
let gameInterval;
let isPlaying = false;

const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");
const gameOverMessage = document.getElementById("game-over-message");

document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("restart-btn").addEventListener("click", startGame);

function startGame() {
    score = 0;
    isPlaying = true;
    scoreDisplay.textContent = "スコア: " + score;
    gameOverScreen.classList.add("hidden");

    clearInterval(gameInterval);
    gameInterval = setInterval(spawnWord, 800);
}

function spawnWord() {
    if (!isPlaying) return;

    const wordElem = document.createElement("div");
    wordElem.classList.add("word");

    // 正解か間違いかをランダムで決定
    const isCorrect = Math.random() < 0.7; // 70%で正解ワード

    let wordText;
    if (isCorrect) {
        wordText = correctWords[Math.floor(Math.random() * correctWords.length)];
    } else {
        const wrongKeys = Object.keys(wrongWords);
        wordText = wrongKeys[Math.floor(Math.random() * wrongKeys.length)];
    }

    wordElem.textContent = wordText;

    // ランダム位置
    const x = Math.random() * (gameArea.clientWidth - 80);
    const y = Math.random() * (gameArea.clientHeight - 80);
    wordElem.style.left = x + "px";
    wordElem.style.top = y + "px";

    // クリック処理
    wordElem.addEventListener("click", () => {
        if (!isPlaying) return;

        if (correctWords.includes(wordText)) {
            score++;
            scoreDisplay.textContent = "スコア: " + score;
            wordElem.remove();
        } else {
            endGame(wordText);
        }
    });

    gameArea.appendChild(wordElem);

    // 自動で消える（3秒）
    setTimeout(() => {
        if (wordElem.parentNode) wordElem.remove();
    }, 3000);
}

function endGame(wrongWord) {
    isPlaying = false;
    clearInterval(gameInterval);

    const message = wrongWords[wrongWord] || "何か間違えた…";
    gameOverMessage.textContent = message;

    gameOverScreen.classList.remove("hidden");
}
