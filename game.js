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
let isPlaying = false;
let spawnDelay = 900; // 初期出現間隔（ms）

const titleScreen = document.getElementById("title-screen");
const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");
const gameOverMessage = document.getElementById("game-over-message");

document.getElementById("title-start-btn").addEventListener("click", startGame);
document.getElementById("restart-btn").addEventListener("click", startGame);

function startGame() {
    // タイトル画面を消す
    titleScreen.classList.add("hidden");

    // ゲーム画面を表示
    gameArea.classList.remove("hidden");
    scoreDisplay.classList.remove("hidden");

    // ゲーム初期化
    score = 0;
    isPlaying = true;
    spawnDelay = 900;
    scoreDisplay.textContent = "スコア: " + score;
    gameOverScreen.classList.add("hidden");

    // 画面クリア
    gameArea.innerHTML = "";

    spawnWordLoop();
}

// 出現間隔が徐々に速くなるループ
function spawnWordLoop() {
    if (!isPlaying) return;

    spawnWord();

    if (spawnDelay > 200) {
        spawnDelay -= 5;
    }

    setTimeout(spawnWordLoop, spawnDelay);
}

function spawnWord() {
    if (!isPlaying) return;

    const wordElem = document.createElement("div");
    wordElem.classList.add("word");

    const rand = Math.random();
    let wordText;

    if (rand < 0.03) {
        wordText = "しま";
    } else if (rand < 0.7) {
        wordText = correctWords[Math.floor(Math.random() * correctWords.length)];
    } else {
        const wrongKeys = Object.keys(wrongWords);
        wordText = wrongKeys[Math.floor(Math.random() * wrongKeys.length)];
    }

    wordElem.textContent = wordText;

    // 重なり防止
    let x, y;
    let safe = false;

    while (!safe) {
        x = Math.random() * (gameArea.clientWidth - 80);
        y = Math.random() * (gameArea.clientHeight - 160);

        safe = true;

        const existingWords = document.querySelectorAll(".word");
        existingWords.forEach(w => {
            const rect1 = { x: x, y: y, w: 80, h: 80 };
            const rect2 = {
                x: parseFloat(w.style.left),
                y: parseFloat(w.style.top),
                w: w.offsetWidth,
                h: w.offsetHeight
            };

            if (
                rect1.x < rect2.x + rect2.w &&
                rect1.x + rect1.w > rect2.x &&
                rect1.y < rect2.y + rect2.h &&
                rect1.y + rect1.h > rect2.y
            ) {
                safe = false;
            }
        });
    }

    wordElem.style.left = x + "px";
    wordElem.style.top = y + "px";

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

    // 画面クリア
    gameArea.innerHTML = "";

    let message;

    if (wrongWord === "miss") {
        message = "暇を潰せなかった…";
    } else {
        const comment = wrongWords[wrongWord] || "何か間違えた…";
        message = `${wrongWord}を潰した\n${comment}`;
    }

    gameOverMessage.textContent = message;
    gameOverScreen.classList.remove("hidden");
}
