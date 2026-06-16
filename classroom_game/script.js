let inventory = [];
let hp = 100;
let isProcessing = false; 
let hasUsedMedkit = false; 
let hasClue = false;
let currentTask = ""; 
let libFailCount = 0; 
let officeFailCount = 0; 

// 題目變數
let libPuzzle = { question: "", answer: "" };
let officePuzzle = { question: "", answer: "" };

let bgm = new Audio('bgm.mp3');
bgm.loop = true;

function playActionSound() {
    let actionSfx = new Audio('sfx_action.mp3');
    actionSfx.play().catch(e => console.log("音效播放失敗，請檢查檔案名稱與路徑", e));
}

// 產生不重複隨機題目
function generatePuzzles() {
    const libPool = [
        { id: 1, question: "1 + 4 = ?", answer: "5" },
        { id: 2, question: "2 + 3 = ?", answer: "5" },
        { id: 3, question: "10 - 5 = ?", answer: "5" },
        { id: 4, question: "7 - 2 = ?", answer: "5" },
        { id: 5, question: "8 - 3 = ?", answer: "5" },
        { id: 6, question: "12 - 5 = ?", answer: "7" },
        { id: 7, question: "3 * 3 = ?", answer: "9" },
        { id: 8, question: "15 / 3 = ?", answer: "5" },
        { id: 9, question: "2 + 8 = ?", answer: "10" },
        { id: 10, question: "11 - 4 = ?", answer: "7" },
        { id: 11, question: "4 * 2 = ?", answer: "8" },
        { id: 12, question: "1 + 9 = ?", answer: "10" },
        { id: 13, question: "20 / 4 = ?", answer: "5" },
        { id: 14, question: "6 + 6 = ?", answer: "12" },
        { id: 15, question: "14 - 8 = ?", answer: "6" },
        { id: 16, question: "3 * 4 = ?", answer: "12" },
        { id: 17, question: "2 + 2 = ?", answer: "4" },
        { id: 18, question: "9 - 3 = ?", answer: "6" },
        { id: 19, question: "5 * 2 = ?", answer: "10" },
        { id: 20, question: "18 / 3 = ?", answer: "6" },
        { id: 21, question: "7 + 4 = ?", answer: "11" },
        { id: 22, question: "10 + 10 = ?", answer: "20" },
        { id: 23, question: "15 - 7 = ?", answer: "8" },
        { id: 24, question: "4 * 4 = ?", answer: "16" },
        { id: 25, question: "20 / 5 = ?", answer: "4" }
    ];
    
    const officePool = [
        { id: 1, question: "2 的 3 次方 (2*2*2) = ?", answer: "8" },
        { id: 2, question: "3 的 2 次方 (3*3) = ?", answer: "9" },
        { id: 3, question: "4 + 4 = ?", answer: "8" },
        { id: 4, question: "20 除以 2 再減 2 = ?", answer: "8" },
        { id: 5, question: "16 / 2 = ?", answer: "8" },
        { id: 6, question: "5 的 2 次方 = ?", answer: "25" },
        { id: 7, question: "10 * 3 = ?", answer: "30" },
        { id: 8, question: "50 - 20 = ?", answer: "30" },
        { id: 9, question: "6 * 6 = ?", answer: "36" },
        { id: 10, question: "100 / 4 = ?", answer: "25" },
        { id: 11, question: "7 * 3 = ?", answer: "21" },
        { id: 12, question: "9 + 11 = ?", answer: "20" },
        { id: 13, question: "45 / 9 = ?", answer: "5" },
        { id: 14, question: "12 + 13 = ?", answer: "25" },
        { id: 15, question: "8 * 4 = ?", answer: "32" },
        { id: 16, question: "50 / 2 = ?", answer: "25" },
        { id: 17, xquestion: "15 + 15 = ?", answer: "30" },
        { id: 18, question: "9 * 4 = ?", answer: "36" },
        { id: 19, question: "60 - 35 = ?", answer: "25" },
        { id: 20, question: "7 * 4 = ?", answer: "28" },
        { id: 21, question: "8 + 12 = ?", answer: "20" },
        { id: 22, question: "10 * 4 = ?", answer: "40" },
        { id: 23, question: "100 - 60 = ?", answer: "40" },
        { id: 24, question: "24 / 2 = ?", answer: "12" },
        { id: 25, question: "5 * 5 = ?", answer: "25" }
    ];

    // 讀取上一局 ID (若無則為 null)
    const lastLibId = parseInt(localStorage.getItem('lastLibId'));
    const lastOfficeId = parseInt(localStorage.getItem('lastOfficeId'));

    // 過濾掉上一局用過的題目
    const availableLib = libPool.filter(p => p.id !== lastLibId);
    const availableOffice = officePool.filter(p => p.id !== lastOfficeId);

    // 隨機選題
    libPuzzle = availableLib[Math.floor(Math.random() * availableLib.length)];
    officePuzzle = availableOffice[Math.floor(Math.random() * availableOffice.length)];

    // 存入新 ID
    localStorage.setItem('lastLibId', libPuzzle.id);
    localStorage.setItem('lastOfficeId', officePuzzle.id);
}

const scenes = {
    'start': { text: "教室門被鎖住。講台上有個發光的東西。", bg: "classroom.jpg", options: [
        { text: "檢查講台", action: () => { handleAction("你拿到『小教室鑰匙』，但手臂被割傷了！HP -10", "corridor", () => { inventory.push("小教室鑰匙"); hp -= 10; }); }},
        { text: "踹門", action: () => { handleAction("門太硬了，你腳很痛... HP -5", "start", () => { hp -= 5; }); }}
    ]},
    'corridor': { text: "走廊陰冷。地上躺著一具穿著校長制服的屍體。", bg: "corridor.jpg", options: [
        { text: "檢查屍體", action: () => { hasClue = true; handleAction("你在屍體口袋發現紙條：『密碼邏輯皆在圖書館內』。", "corridor"); }},
        { text: "進入圖書館", next: 'library' },
        { text: "前往校長室", next: 'office' },
        { text: "進入儲藏室", action: () => {
            // 如果急救箱開過了，進儲藏室就直接強制去打開的場景，不然就去正常的儲藏室
            if (hasUsedMedkit) { updateScene('storage_opened'); } 
            else { updateScene('storage'); }
        }},
        { text: "前往樓梯間", next: 'stairwell' },
        { text: "徘徊在走廊...", action: () => { handleAction("你感覺背後有一雙眼睛盯著你，嚇得渾身發抖！HP -5", "corridor", () => { hp -= 5; }); }}
    ]},
    'library': { 
        get text() { return `書架上筆記寫著：\n1.儲藏室急救箱機關密碼：${libPuzzle.question}\n2. 校長室保險箱密碼：${officePuzzle.question}`; }, 
        bg: "library.jpg", 
        options: [
            { text: "翻閱舊報紙", action: () => handleAction("報紙記載慘案，你看得頭暈目眩... HP -5", "library", () => { hp -= 5; })},
            { text: "解開急救箱機關", action: () => openModal("請輸入密碼", "library_storage_puzzle"), condition: () => !inventory.includes("急救箱鑰匙") && !hasUsedMedkit },
            { text: "解開校長室保險箱密碼", action: () => {
                if (!hasClue) { handleAction("請前往校長室輸入密碼...", "library"); }
                else { openModal("請輸入校長室密碼", "library_office_puzzle"); }
            }, condition: () => !inventory.includes("頂樓鑰匙") },
            { text: "返回走廊", next: 'corridor' }
    ]},
    'storage': { text: "這是一間塵封的儲藏室，裡面有個急救箱。", bg: "storage_closed.jpg", options: [
        { text: "開啟急救箱", action: () => {
            if (inventory.includes("急救箱鑰匙")) { 
                hasUsedMedkit = true; 
                // 成功開啟後：跳提示、2秒後自動轉移到 storage_opened 場景（換成已打開的圖，且只會有返回按鈕）
                handleAction("你開了急救箱，用了急救包！HP 全滿！", "storage_opened", () => { hp = 100; }); 
            } else { 
                hp -= 15; 
                handleAction("鑰匙沒對上，急救箱卡住了，你受傷了！HP -15", "storage"); 
            }
        }},
        { text: "返回走廊", next: 'corridor' }
    ]},
    'storage_opened': { text: "急救箱已經被打開且清空了。", bg: "storage_opened.jpg", options: [{ text: "返回走廊", next: 'corridor' }]},
    'office': { 
        get text() { return inventory.includes("頂樓鑰匙") ? "保險箱已經打開，裡面空無一物。" : "保險箱閃著紅光。"; }, 
        bg: "office.jpg", 
        options: [
            { text: "輸入密碼", action: () => openModal("請輸入保險箱密碼", "office_puzzle"), condition: () => !inventory.includes("頂樓鑰匙") },
            { text: "返回走廊", next: 'corridor' }
        ] 
    },
    'stairwell': { text: "頂樓鐵門深鎖。", bg: "stairwell.jpg", options: [
        { text: "使用頂樓鑰匙", action: () => { 
            playActionSound();
            handleAction("門開了！", "win"); 
        }, condition: () => inventory.includes("頂樓鑰匙") },
        { text: "嘗試撞門", action: () => { handleAction("你撞得頭破血流，但門沒開。HP -30", "stairwell", () => { hp -= 30; }); }},
        { text: "返回走廊", next: 'corridor' }
    ]},
    'win': { text: "你逃出去了！", bg: "rooftop.jpg", options: [{ text: "重新開始", action: () => location.reload() }]},
    'lose': { text: "你倒下了... 遊戲結束。", bg: "gameover.jpg", options: [{ text: "重新開始", action: () => location.reload() }]}
};

function handleAction(msg, nextSceneId, actionFn) {
    if (isProcessing) return;
    isProcessing = true;
    document.getElementById('story-text').style.display = 'none';
    document.getElementById('button-container').style.display = 'none';
    const box = document.getElementById('message-box');
    box.innerText = msg;
    box.classList.remove('hidden');
    setTimeout(() => {
        box.classList.add('hidden');
        if (actionFn) actionFn();
        isProcessing = false;
        updateScene(nextSceneId);
    }, 2000);
}

function updateScene(sceneId) {
    if (hp <= 0) sceneId = 'lose';
    const scene = scenes[sceneId];
    document.body.classList.add('fade-out');
    setTimeout(() => {
        document.body.style.backgroundImage = `url('${scene.bg}')`;
        const textEl = document.getElementById('story-text');
        textEl.innerText = typeof scene.text === 'function' ? scene.text() : scene.text;
        textEl.style.display = 'block';
        document.getElementById('stats').innerText = `HP: ${hp} | 背包: ${inventory.join(', ')}`;
        const container = document.getElementById('button-container');
        container.innerHTML = '';
        container.style.display = 'flex';
        scene.options.forEach(opt => {
            if (opt.condition && !opt.condition()) return;
            const btn = document.createElement('button');
            btn.innerText = opt.text;
            btn.onclick = () => { if (isProcessing) return; opt.action ? opt.action() : updateScene(opt.next); };
            container.appendChild(btn);
        });
        document.body.classList.remove('fade-out');
    }, 500);
}

function openModal(title, task) {
    document.getElementById('modal-title').innerText = title;
    currentTask = task;
    document.getElementById('password-modal').classList.remove('hidden');
}

function checkAnswer() {
    const input = document.getElementById('password-input').value;
    document.getElementById('password-modal').classList.add('hidden');
    document.getElementById('password-input').value = '';

    let nextScene = "";
    if (currentTask === "library_storage_puzzle") {
        nextScene = "library";
        if (input === libPuzzle.answer) { inventory.push("急救箱鑰匙"); handleAction("正確！獲得『急救箱鑰匙』。", nextScene); libFailCount = 0; }
        else { libFailCount++; handleAction(libFailCount >= 3 ? `提示：答案是 ${libPuzzle.answer}` : "錯誤！HP -10", nextScene, () => { hp -= 10; }); }
    } else {
        nextScene = (currentTask === "office_puzzle") ? "office" : "library";
        if (input === officePuzzle.answer) { inventory.push("頂樓鑰匙"); handleAction("正確！獲得『頂樓鑰匙』。", nextScene); officeFailCount = 0; }
        else { officeFailCount++; handleAction(officeFailCount >= 3 ? `提示：答案是 ${officePuzzle.answer}` : "錯誤！HP -20", nextScene, () => { hp -= 20; }); }
    }
}

window.onload = () => {
    generatePuzzles();
    document.addEventListener('click', () => { bgm.play().catch(()=>{}); }, { once: true });
    updateScene('start');
};