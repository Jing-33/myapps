// ==========================================
// 1. 完整 40 題高品質題庫
// ==========================================
const allQuizBank = [
    { hint: "這是一本非常有趣的書。", correctSentence: "This is a very interesting book.", words: ["This", "is", "a", "very", "interesting", "book."] },
    { hint: "你今天過得怎麼樣？", correctSentence: "How was your day today?", words: ["How", "was", "your", "day", "today?"] },
    { hint: "別忘了在離開前關燈。", correctSentence: "Don't forget to turn off the light before leaving.", words: ["Don't", "forget", "to", "turn", "off", "the", "light", "before", "leaving."] },
    { hint: "熟能生巧。（西方經典諺語）", correctSentence: "Practice makes perfect.", words: ["Practice", "makes", "perfect."] },
    { hint: "如果你明天有空，我們就去野餐。", correctSentence: "If you are free tomorrow, we will go on a picnic.", words: ["If", "you", "are", "free", "tomorrow,", "we", "will", "go", "on", "a", "picnic."] },
    { hint: "他太累了，以至於無法走回家。", correctSentence: "He was too tired to walk home.", words: ["He", "was", "too", "tired", "to", "walk", "home."] },
    { hint: "雖然下著大雨，他們還是去慢跑了。", correctSentence: "Although it was raining heavily, they went jogging.", words: ["Although", "it", "was", "raining", "heavily,", "they", "went", "jogging."] },
    { hint: "這是我這輩子看過最好看的電影！", correctSentence: "This is the best movie I have ever seen!", words: ["This", "is", "the", "best", "movie", "I", "have", "ever", "seen!"] },
    { hint: "學一門新語言需要時間和耐心。", correctSentence: "Learning a new language takes time and patience.", words: ["Learning", "a", "new", "language", "takes", "time", "and", "patience."] },
    { hint: "我一到家就打電話給你。", correctSentence: "I will call you as soon as I get home.", words: ["I", "will", "call", "you", "as", "soon", "as", "I", "get", "home."] },
    { hint: "太陽從東方升起。", correctSentence: "The sun rises in the east.", words: ["The", "sun", "rises", "in", "the", "east."] },
    { hint: "她喜歡在睡前聽音樂。", correctSentence: "She likes to listen to music before going to bed.", words: ["She", "likes", "to", "listen", "to", "music", "before", "going", "to", "bed."] },
    { hint: "地球繞着太陽轉。", correctSentence: "The earth goes around the sun.", words: ["The", "earth", "goes", "around", "the", "sun."] },
    { hint: "抱歉，我可以借你的筆嗎？", correctSentence: "Excuse me, may I borrow your pen?", words: ["Excuse", "me,", "may", "I", "borrow", "your", "pen?"] },
    { hint: "這家餐廳以其美味的披薩聞名。", correctSentence: "This restaurant is famous for its delicious pizza.", words: ["This", "restaurant", "is", "famous", "for", "its", "delicious", "pizza."] },
    { hint: "我們應該保護環境並節約能源。", correctSentence: "We should protect the environment and save energy.", words: ["We", "should", "protect", "the", "environment", "and", "save", "energy."] },
    { hint: "你打算如何度過你的暑假？", correctSentence: "How are you going to spend your summer vacation?", words: ["How", "are", "you", "going", "to", "spend", "your", "summer", "vacation?"] },
    { hint: "多喝水對你的健康有益。", correctSentence: "Drinking more water is good for your health.", words: ["Drinking", "more", "water", "is", "good", "for", "your", "health."] },
    { hint: "我找不到我的鑰匙，你看到了嗎？", correctSentence: "I cannot find my keys, have you seen them?", words: ["I", "cannot", "find", "my", "keys,", "have", "you", "seen", "them?"] },
    { hint: "這是一生只有一次的難得機會。", correctSentence: "This is a once in a lifetime opportunity.", words: ["This", "is", "a", "once", "in", "a", "lifetime", "opportunity."] },
    { hint: "為了保持健康，他每天規律運動。", correctSentence: "He exercises regularly every day to stay healthy.", words: ["He", "exercises", "regularly", "every", "day", "to", "stay", "healthy."] },
    { hint: "遲到總比不到好。（西方經典諺語）", correctSentence: "Better late than never.", words: ["Better", "late", "than", "never."] },
    { hint: "那部新電影下週將在電影院上映。", correctSentence: "That new movie will be released in theaters next week.", words: ["That", "new", "movie", "will", "be", "released", "in", "theaters", "next", "week."] },
    { hint: "你越努力，你就會越幸運。", correctSentence: "The harder you work, the luckier you will be.", words: ["The", "harder", "you", "work,", "the", "luckier", "you", "will", "be."] },
    { hint: "在公共場所大聲說話是很沒禮貌的。", correctSentence: "It is rude to talk loudly in public places.", words: ["It", "is", "rude", "to", "talk", "loudly", "in", "public", "places."] },
    { hint: "我想在未來的某一天環遊世界。", correctSentence: "I want to travel around the world someday in the future.", words: ["I", "want", "to", "travel", "around", "the", "world", "someday", "in", "the", "future."] },
    { hint: "這項科學計畫花了他三個月的時間完成。", correctSentence: "This science project took him three months to complete.", words: ["This", "science", "project", "took", "him", "three", "months", "to", "complete."] },
    { hint: "由於壞天氣，航班被取消了。", correctSentence: "The flight was canceled due to the bad weather.", words: ["The", "flight", "was", "canceled", "due", "to", "the", "bad", "weather."] },
    { hint: "她不僅聰明，而且非常善良。", correctSentence: "She is not only smart but also very kind.", words: ["She", "is", "not", "only", "smart", "but", "also", "very", "kind."] },
    { hint: "預防勝於治療。（健康經典諺語）", correctSentence: "Prevention is better than cure.", words: ["Prevention", "is", "better", "than", "cure."] },
    { hint: "這個問題太複雜了，我無法解決。", correctSentence: "This problem is too complex for me to solve.", words: ["This", "problem", "is", "too", "complex", "for", "me", "to", "solve."] },
    { hint: "你知道最近的火車站怎麼走嗎？", correctSentence: "Do you know how to get to the nearest train station?", words: ["Do", "you", "know", "how", "to", "get", "to", "the", "nearest", "train", "station?"] },
    { hint: "看電視浪費了我們很多寶貴的時間。", correctSentence: "Watching TV wastes a lot of our valuable time.", words: ["Watching", "TV", "wastes", "a", "lot", "of", "our", "valuable", "time."] },
    { hint: "雖然他犯了錯，老師還是原諒了他。", correctSentence: "Although he made a mistake, the teacher forgave him.", words: ["Although", "he", "made", "a", "mistake,", "the", "teacher", "forgave", "him."] },
    { hint: "閱讀能開闊我們的視野，增長知識。", correctSentence: "Reading can broaden our horizons and increase our knowledge.", words: ["Reading", "can", "broaden", "our", "horizons", "and", "increase", "our", "knowledge."] },
    { hint: "你昨天為什麼沒有去參加生日派對？", correctSentence: "Why didn't you go to the birthday party yesterday?", words: ["Why", "didn't", "you", "go", "to", "the", "birthday", "party", "yesterday?"] },
    { hint: "我們必須學會如何與不同的人合作。", correctSentence: "We must learn how to cooperate with different people.", words: ["We", "must", "learn", "how", "to", "cooperate", "with", "different", "people."] },
    { hint: "如果我是你，我就會接受這份工作。", correctSentence: "If I were you, I would accept the job offer.", words: ["If", "I", "were", "you,", "I", "would", "accept", "the", "job", "offer."] },
    { hint: "這首老歌總是讓我想起我的童年。", correctSentence: "This old song always reminds me of my childhood.", words: ["This", "old", "song", "always", "reminds", "me", "of", "my", "childhood."] },
    { hint: "不管發生什麼事，我都會支持你。", correctSentence: "No matter what happens, I will always support you.", words: ["No", "matter", "what", "happens,", "I", "will", "always", "support", "you."] }
];

// ==========================================
// 2. 遊戲狀態與 DOM 元素抓取
// ==========================================
const GAME_TOTAL_QUESTIONS = 10;
let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let shuffledWords = [];

const scoreEl = document.getElementById("score");
const progressEl = document.getElementById("progress");
const hintTextEl = document.getElementById("hint-text");
const answerZoneEl = document.getElementById("answer-zone");
const wordZoneEl = document.getElementById("word-zone");
const gameContainer = document.getElementById("game-container");
const resultContainer = document.getElementById("result-container");
const finalScoreEl = document.getElementById("final-score");

const studyContainer = document.getElementById("study-container");
const studyListEl = document.getElementById("study-list");
const quizPlayZone = document.getElementById("quiz-play-zone");
const btnStartQuiz = document.getElementById("btn-start-quiz");

const btnReset = document.getElementById("btn-reset");
const btnCheck = document.getElementById("btn-check");
const btnRestart = document.getElementById("btn-restart");

const quizModal = document.getElementById("quiz-modal");
const modalIcon = document.getElementById("modal-icon");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const btnModalNext = document.getElementById("btn-modal-next");

// ==========================================
// 🔊 核心功能：純 JavaScript 聲音合成器
// ==========================================
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(freq, type, duration, startTimeOffset = 0) {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTimeOffset);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime + startTimeOffset);
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + startTimeOffset + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + startTimeOffset);
    osc.stop(audioCtx.currentTime + startTimeOffset + duration);
}

function playClickSound() { playTone(600, 'sine', 0.08); }
function playCorrectSound() { playTone(523.25, 'triangle', 0.15, 0); playTone(659.25, 'triangle', 0.25, 0.08); }
function playWrongSound() { playTone(180, 'sawtooth', 0.3); }

// ==========================================
// 3. 核心邏輯功能
// ==========================================
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function initGame() {
    currentQuestionIndex = 0;
    score = 0;
    scoreEl.innerText = score;

    const shuffledBank = shuffle([...allQuizBank]);
    quizData = shuffledBank.slice(0, GAME_TOTAL_QUESTIONS);
    
    studyContainer.classList.remove("hidden");
    quizPlayZone.classList.add("hidden");
    resultContainer.classList.add("hidden");

    studyListEl.innerHTML = "";
    quizData.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-indigo-50/30 transition-colors";
        itemDiv.innerHTML = `
            <div class="font-bold text-indigo-600 mb-0.5">第 ${index + 1} 題預習</div>
            <div class="text-slate-500 text-xs mb-1">💡 中文提示：${item.hint}</div>
            <div class="text-slate-800 font-semibold text-base">${item.correctSentence}</div>
        `;
        studyListEl.appendChild(itemDiv);
    });
}

btnStartQuiz.onclick = () => {
    playClickSound();
    studyContainer.classList.add("hidden");
    quizPlayZone.classList.remove("hidden");
    loadQuestion();
};

function loadQuestion() {
    userAnswers = [];
    renderAnswerZone();

    const currentQuiz = quizData[currentQuestionIndex];
    progressEl.innerText = `${currentQuestionIndex + 1} / ${quizData.length}`;
    hintTextEl.innerText = currentQuiz.hint;
    scoreEl.innerText = score;

    shuffledWords = shuffle([...currentQuiz.words]);

    wordZoneEl.innerHTML = "";
    shuffledWords.forEach((word, index) => {
        const btnId = `word-btn-${index}`;
        const wordBtn = document.createElement("button");
        wordBtn.id = btnId;
        wordBtn.className = "bg-white hover:bg-indigo-100 border border-slate-300 px-4 py-2 rounded-lg font-medium shadow-sm transition-all active:scale-95 text-slate-700";
        wordBtn.innerText = word;

        wordBtn.onclick = () => {
            playClickSound();
            selectWord(word, btnId);
        };
        wordZoneEl.appendChild(wordBtn);
    });
}

function selectWord(word, btnId) {
    userAnswers.push({ text: word, btnId: btnId });
    renderAnswerZone();
    const selectedBtn = document.getElementById(btnId);
    if (selectedBtn) {
        selectedBtn.classList.add("opacity-0", "pointer-events-none");
    }
}

function renderAnswerZone() {
    if (userAnswers.length === 0) {
        answerZoneEl.innerHTML = `<span class="text-slate-400 italic text-sm">請點擊下方的單字拼圖...</span>`;
        return;
    }
    answerZoneEl.innerHTML = "";
    userAnswers.forEach((item, index) => {
        const answerSpan = document.createElement("span");
        answerSpan.className = "bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold shadow-sm cursor-pointer hover:bg-indigo-700 transition-all";
        answerSpan.innerText = item.text;
        answerSpan.onclick = () => {
            playClickSound();
            removeWord(index);
        };
        answerZoneEl.appendChild(answerSpan);
    });
}

function removeWord(index) {
    const removedItem = userAnswers[index];
    userAnswers.splice(index, 1);
    renderAnswerZone();
    const targetBtn = document.getElementById(removedItem.btnId);
    if (targetBtn) {
        targetBtn.classList.remove("opacity-0", "pointer-events-none");
    }
}

btnCheck.onclick = () => {
    if (userAnswers.length === 0) {
        alert("請先排列單字再檢查答案喔！");
        return;
    }

    const userSentence = userAnswers.map(item => item.text).join(" ");
    const currentQuiz = quizData[currentQuestionIndex];

    quizModal.classList.remove("hidden");

    if (userSentence === currentQuiz.correctSentence) {
        score += 10;
        playCorrectSound();
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });

        modalIcon.innerText = "🎉";
        modalTitle.innerText = "太棒了！答對了！";
        modalTitle.className = "text-2xl font-bold text-green-600 mb-2";
        modalMessage.innerText = `完美重組句子！你得到了 10 分。`;
    } else {
        playWrongSound();
        modalIcon.innerText = "❌";
        modalTitle.innerText = "可惜答錯了！";
        modalTitle.className = "text-2xl font-bold text-red-600 mb-2";
        modalMessage.innerHTML = `正確答案是：<br><strong class="text-slate-800">${currentQuiz.correctSentence}</strong>`;
    }
};

btnModalNext.onclick = () => {
    playClickSound();
    quizModal.classList.add("hidden");

    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showResult();
    }
};

btnReset.onclick = () => {
    playClickSound();
    userAnswers.forEach(item => {
        const targetBtn = document.getElementById(item.btnId);
        if (targetBtn) targetBtn.classList.remove("opacity-0", "pointer-events-none");
    });
    userAnswers = [];
    renderAnswerZone();
};

function showResult() {
    quizPlayZone.classList.add("hidden");
    resultContainer.classList.remove("hidden");
    finalScoreEl.innerText = score;

    if (score >= 70) {
        let duration = 3 * 1000;
        let end = Date.now() + duration;

        (function frame() {
            confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 } });
            confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 } });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }
}

btnRestart.onclick = () => {
    playClickSound();
    initGame();
};

window.onload = () => {
    initGame();
};