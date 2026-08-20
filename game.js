// 正解ワード
const correctWords = ["暇", "ひま", "暇ー！", "ひま〜", "ヒマ", "ひまだな〜"];

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
    "しま": "日本が沈没した…"
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
    gameInterval = setInterval(spawnWord, 900);
}

function spawnWord() {
    if (!isPlaying) return;

    const wordElem = document.createElement("div");
    wordElem.classList.add("word");

    // 出現確率
    const rand = Math.random();
    let wordText;

    if (rand < 0.03) {
        // 3%で「しま」
        wordText = "しま";
    } else if (rand < 0.7) {
        // 67%で正解ワード
        wordText = correctWords[Math.floor(Math.random() * correctWords.length)];
    } else {
        // 30%で間違いワード
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

    // 3秒後に消える → 押せなかったら終了
    setTimeout(() => {
        if (wordElem.parentNode) {
            if (correctWords.includes(wordText)) {
                endGame("miss");
            }
            wordElem.remove();
        }
    }, 3000);
}

function endGame(wrongWord) {
    isPlaying = false;
    clearInterval(gameInterval);

    let message;

    if (wrongWord === "miss") {
        message = "暇が潰せなかった…";
    } else {
        message = wrongWords[wrongWord] || "何か間違えた…";
        message = `${wrongWord}を潰した\n${comment}`;
    }

    gameOverMessage.textContent = message;
    gameOverScreen.classList.remove("hidden");
}
