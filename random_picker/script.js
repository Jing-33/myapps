const PRESETS = {
    food: ["火鍋暢快吃", "濃厚豚骨拉麵", "脆皮韓式炸雞", "黑金鮮汁滷肉飯", "麥當勞豪飽餐", "義式窯烤大披薩", "家常排骨便當", "爭鮮迴轉壽司", "健康鮮蔬沙拉", "現包爆汁水餃"],
    drink: ["波霸珍珠奶茶", "極致冰美式", "黃金四季春", "香濃多多綠", "小芋圓鮮奶茶", "巨無霸楊枝甘露", "芝芝多肉莓莓", "宇治抹茶拿鐵", "古早味檸檬冬瓜", "爆打香檸手搖茶"],
    dessert: ["法式烤布蕾", "草莓千層蛋糕", "巧克力布朗尼", "脆皮黑糖吉拿棒", "抹茶宇治金時冰", "宇治焙茶生巧克力", "芋頭牛奶雪花冰", "現烤比利時鬆餅"],
    play: ["痛快暢玩打電動", "無腦躺平追劇", "熱血球場打籃球", "西門町逛街爆買", "電影院看大片", "被窩大睡特睡", "看一本好書", "瘋狂手撕程式碼", "音樂環繞大放空"],
    where: ["台北西門町商圈", "台中逢甲夜市", "高雄駁二特區", "宜蘭礁溪溫泉", "台南安平老街", "澎湖沙灘看海", "巷口文青公園", "舒服的自家床鋪", "巨型百貨公司"],
    buy: ["流行新衣物", "高質感機械鍵盤", "極致抗噪耳機", "香氛蠟燭療癒小物", "酷炫模型公仔", "美味零食大禮包", "實用日常保養品", "微縮像素電子雞"],
    watch: ["好萊塢科幻大片", "熱血戰鬥番動漫", "超甜戀愛偶像劇", "燒腦懸疑推理片", "爆笑網路短影音", "實況主精華剪輯", "催淚溫馨紀錄片", "經典驚悚恐怖片"],
    sport: ["公園盡情慢跑", "室內健身房重訓", "揮汗如雨打羽球", "放鬆身心伸展瑜珈", "游泳池暢快游泳", "呼朋引伴打桌球", "居家高強度HIIT", "熱血街頭滑板"],
    music: ["重低音電子音樂", "溫柔療癒Lo-Fi", "熱血動漫搖滾主題曲", "經典華語懷舊流行", "浪漫微醺爵士樂", "史詩交響電影配樂", "輕快獨立K-Pop", "放鬆大自然白噪音"],
    study: ["精進前端前端切版", "背15個英文單字", "閱讀財經商業雜誌", "練習演算法LeetCode", "看科技新知YouTube", "撰寫個人技術筆記", "整理房間實踐斷捨離", "複習期末必考大綱"],
    // ✨ 新增主題 11 與 12 的資料庫內容
    work: ["清空收件匣郵件", "整理下週待辦清單", "優化程式重構專案", "撰寫產品功能規格", "與團隊同步進度", "設計簡報視覺提案", "進行程式碼審查", "備份重要雲端專案"],
    relax: ["深度冥想十分鐘", "點燃香氛精油蠟燭", "去陽台曬太陽發呆", "熱敷眼睛聽大自然音效", "泡熱水澡放鬆肌肉", "喝杯熱呼呼的洋甘菊茶", "做一套全身拉伸操", "揉揉貓咪肉墊"]
};

let options = [];
let isSpinning = false;
let isDeciding = false; 
let lastSelectedResult = ""; 

const screen = document.getElementById('display-screen');
const screenContainer = document.getElementById('screen-container');
const container = document.getElementById('options-container');
const decisionPanel = document.getElementById('decision-panel');
const countSpan = document.getElementById('option-count');
const input = document.getElementById('option-input');
const batchInput = document.getElementById('batch-input');
const spinBtn = document.getElementById('btn-spin');
const nekoAvatar = document.getElementById('neko-avatar');
const nekoBubble = document.getElementById('neko-bubble');

let audioCtx = null;

const NEKO_IDLE = ` /\\___/\\
(  o.o  )
 >  ^  <`;

const NEKO_SPIN = ` /\\___/\\
(  >.<  )
 > 👅 <`;

const NEKO_WIN  = ` /\\___/\\
(  v.v  )
 >  3  <`;

const NEKO_ASK  = ` /\\___/\\
(  ?.?  )
 >  w  <`;

const NEKO_BAN  = ` /\\___/\\
(  X.X  )
 > 👅 <`;

const SLOGANS = [
    "貓貓系統：本喵今天心情好，才幫你選的 // 🐟",
    "貓貓核心：選什麼都好，反正罐罐記得開 // 🥫",
    "命運核心：聽貓大師的話，你就不會踩雷 // 🔮"
];
const randomSlogan = SLOGANS[Math.floor(Math.random() * SLOGANS.length)];
document.getElementById('neko-slogan').innerText = randomSlogan;

renderOptions();
updateScreenPlaceholder();

function toggleControlPanel() {
    const content = document.getElementById('control-content');
    const arrow = document.getElementById('fold-arrow');
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        content.classList.add('flex');
        arrow.style.transform = 'rotate(90deg)';
    } else {
        content.classList.remove('flex');
        content.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
    }
}

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playTone(freq, duration, type = 'sine', volume = 0.2) { 
    try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        gain.gain.setValueAtTime(volume, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch(e) {}
}

function addBatchOptions() {
    if (isSpinning || isDeciding) return;
    const text = batchInput.value.trim();
    if (!text) return;

    const rawItems = text.split(/[\n，,]+/);
    let addedCount = 0;

    rawItems.forEach(item => {
        const cleaned = item.trim();
        if (cleaned && !options.includes(cleaned)) {
            options.push(cleaned);
            addedCount++;
        }
    });

    if (addedCount > 0) {
        batchInput.value = ''; 
        playTone(600, 0.1);
        setTimeout(() => playTone(900, 0.15), 60);
        renderOptions();
        updateScreenPlaceholder();
        
        nekoBubble.innerText = `成功注入了 ${addedCount} 筆資料喵！`;
        screen.innerText = `成功注入 ${addedCount} 筆資料`;
        screen.className = "text-xl md:text-3xl font-black tracking-widest text-cyan-400 font-mono py-6";
        
        if(window.innerWidth < 1024) setTimeout(toggleControlPanel, 800);
    } else {
        playTone(200, 0.2, 'sawtooth');
    }
}

function injectPreset(type) {
    if (isSpinning || isDeciding) return;
    options = [...PRESETS[type]];
    const addedCount = options.length; 
    renderOptions();
    updateScreenPlaceholder();
    hideDecisionPanel();
    
    playTone(600, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(800, 0.1, 'sine', 0.2), 50);
    
    // ✨ 在這裡的中文化字典對應中加入新主題的對照名稱
    const typeMap = { 
        food: "吃飯", drink: "飲料", dessert: "點心", play: "消遣", 
        where: "去哪", buy: "買啥", watch: "看啥", sport: "運動", 
        music: "聽啥", study: "學習", work: "工作", relax: "放鬆" 
    };
    const typeChinese = typeMap[type] || type;
    
    nekoBubble.innerText = `已載入【${typeChinese}】主題，共 ${addedCount} 筆資料喵！`;
    screen.innerText = `${typeChinese}主題載入完成`;
    screen.className = "text-xl md:text-4xl font-black tracking-widest text-rose-400 font-mono py-6";
    
    if(window.innerWidth < 1024) setTimeout(toggleControlPanel, 800);
}

function updateScreenPlaceholder() {
    if (options.length === 0) {
        screen.innerText = "池中無物喵";
        screen.className = "text-2xl md:text-4xl font-black tracking-widest text-slate-600 font-mono py-6";
    } else {
        screen.innerText = "喵準備就緒";
        screen.className = "text-2xl md:text-5xl font-black tracking-widest text-cyan-400 font-mono py-6 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]";
    }
}

function renderOptions() {
    container.innerHTML = '';
    countSpan.innerText = options.length;
    if (options.length === 0) {
        container.innerHTML = `<span class="text-[11px] text-slate-600 p-2 w-full text-center font-mono">目前池子空空的 // 請在上方貼上資料或點擊貓貓推薦</span>`;
        return;
    }
    options.forEach((opt, index) => {
        const tag = document.createElement('div');
        tag.className = 'flex items-center gap-1.5 bg-slate-900 border border-white/10 pl-3 pr-2 py-1.5 rounded-xl text-xs text-slate-200 transition-all hover:border-rose-400/50';
        tag.innerHTML = `<span>${opt}</span><button onclick="removeOption(${index})" class="text-slate-500 hover:text-rose-400 font-bold text-sm ml-0.5">&times;</button>`;
        container.appendChild(tag);
    });
}

function addOption() {
    if (isSpinning || isDeciding) return;
    const val = input.value.trim();
    if (!val) return;
    if (options.includes(val)) {
        playTone(200, 0.2, 'sawtooth');
        return;
    }
    options.push(val);
    input.value = '';
    playTone(800, 0.08);
    renderOptions();
    updateScreenPlaceholder();
    
    nekoBubble.innerText = "成功注入 1 筆新資料喵！";
}

function removeOption(index) {
    if (isSpinning || isDeciding) return;
    options.splice(index, 1);
    playTone(400, 0.06);
    renderOptions();
    updateScreenPlaceholder();
    
    nekoBubble.innerText = "已將該項目從池中移除喵。";
}

function clearAll() {
    if (isSpinning || isDeciding) return;
    options = []; renderOptions();
    updateScreenPlaceholder();
    hideDecisionPanel();
    playTone(150, 0.2, 'triangle');
    
    nekoBubble.innerText = "池子已完全清空喵！";
}

function startSpin() {
    if (options.length < 2) {
        playTone(200, 0.2, 'sawtooth');
        alert('池子裡至少要放兩個事件才能開始抽獎喵！請利用左側設定注入資料！');
        return;
    }

    initAudio();
    isSpinning = true;
    spinBtn.disabled = true;
    hideDecisionPanel();
    
    nekoAvatar.innerText = NEKO_SPIN;
    nekoAvatar.classList.add('animate-neko');
    nekoBubble.innerText = "✨ 正在計算命運的量子矩陣...";

    screen.className = "text-2xl md:text-5xl lg:text-6xl font-black tracking-widest text-cyan-400 font-mono py-6 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]";

    let duration = 2400;
    let elapsed = 0;
    let intervalTime = 100;

    function runLoop() {
        if (elapsed >= duration * 0.75) {
            slowDownLoop(intervalTime, duration * 0.25);
            return;
        }

        const randomIndex = Math.floor(Math.random() * options.length);
        screen.innerText = options[randomIndex];

        const progress = elapsed / (duration * 0.75);
        const currentFreq = 500 + (progress * 600);
        
        playTone(currentFreq, 0.015, 'sine', 0.15);

        elapsed += intervalTime;
        if (intervalTime > 25) intervalTime -= 10;

        setTimeout(runLoop, intervalTime);
    }

    runLoop();
}

function slowDownLoop(currentInterval, remainingTime) {
    if (remainingTime <= 0) {
        finalizeSelection();
        return;
    }
    const nextInterval = currentInterval + 40;
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * options.length);
        screen.innerText = options[randomIndex];
        
        playTone(450, 0.03, 'sine', 0.15);
        slowDownLoop(nextInterval, remainingTime - nextInterval);
    }, currentInterval);
}

function finalizeSelection() {
    isSpinning = false;
    isDeciding = true; 
    lastSelectedResult = screen.innerText;
    
    nekoAvatar.classList.remove('animate-neko');
    nekoAvatar.innerText = NEKO_ASK;
    nekoBubble.innerText = "🤔 命運之選已定格！滿意這個結果嗎？";

    screen.className = "text-2xl md:text-5xl lg:text-6xl font-black tracking-widest text-yellow-300 font-mono py-6 drop-shadow-[0_0_20px_rgba(250,204,21,0.7)] animate-bounce";
    
    showDecisionPanel();

    playTone(523.25, 0.1, 'sine', 0.25);
    setTimeout(() => playTone(659.25, 0.1, 'sine', 0.25), 60);
    setTimeout(() => playTone(783.99, 0.1, 'sine', 0.25), 120);
    setTimeout(() => playTone(987.77, 0.25, 'sine', 0.3), 180);
}

function showDecisionPanel() {
    decisionPanel.classList.remove('hidden');
    setTimeout(() => {
        decisionPanel.classList.remove('opacity-0', 'translate-y-2');
    }, 50);
}

function hideDecisionPanel() {
    decisionPanel.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => {
        decisionPanel.classList.add('hidden');
    }, 300);
}

function handleDecision(type) {
    if (!isDeciding) return;
    isDeciding = false;
    hideDecisionPanel();
    
    if (type === 'keep') {
        playTone(880, 0.15, 'sine', 0.25);
        nekoAvatar.innerText = NEKO_WIN;
        nekoBubble.innerText = "💕 太棒了！本喵祝你進行順利喵！";
        spinBtn.disabled = false;
    } else if (type === 'ban') {
        const index = options.indexOf(lastSelectedResult);
        if (index !== -1) {
            options.splice(index, 1);
            renderOptions();
        }

        playTone(150, 0.35, 'triangle', 0.3);
        nekoAvatar.innerText = NEKO_BAN;
        nekoBubble.innerText = "💔 已幫你狠狠地把該項目封印踢除喵！";
        screenContainer.className = screenContainer.className.replace('border-rose-500/40 shadow-neon-kawaii', 'border-pink-600 shadow-neon-pink bg-rose-950/20');
        screen.innerText = "項目已被踢除";
        screen.className = "text-2xl md:text-5xl lg:text-6xl font-black tracking-widest text-rose-500 font-mono py-6";

        setTimeout(() => {
            screenContainer.className = screenContainer.className.replace('border-pink-600 shadow-neon-pink bg-rose-950/20', 'border-rose-500/40 shadow-neon-kawaii');
            nekoAvatar.innerText = NEKO_IDLE;
            nekoBubble.innerText = "喵～等待下一個指令中";
            updateScreenPlaceholder();
            spinBtn.disabled = false;
        }, 1200);
    }
}