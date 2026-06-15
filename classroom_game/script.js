// ==========================================
// 🎮 密室逃脫：校園驚魂 — 完整核心腳本 (內建柔和轉場版)
// ==========================================

// 遊戲狀態變數
let hp = 100;
let inventory = [];

// 🎯 高級柔和轉場函式：取代原本粗暴的硬切圖片
function changeBackgroundSmoothly(imageName) {
    // 確保讀取你上傳的超快 .jpg 輕量圖
    const imageUrl = imageName.replace('.png', '.jpg');
    const bgContainer = document.getElementById('background') || document.body;
    
    // 1. 建立一個全新的暫存淡入層
    const fadeLayer = document.createElement('div');
    fadeLayer.className = 'bg-fade-layer';
    fadeLayer.style.backgroundImage = `url('${imageUrl}')`;
    bgContainer.appendChild(fadeLayer);
    
    // 2. 讓瀏覽器微微準備一下，然後把透明度變 1 (柔和淡入)
    setTimeout(() => {
        fadeLayer.style.opacity = '1';
    }, 50);
    
    // 3. 等 0.8 秒轉場動畫結束後，把底層同步換成新圖，並把暫存層洗掉維持效能
    setTimeout(() => {
        bgContainer.style.backgroundImage = `url('${imageUrl}')`;
        fadeLayer.remove();
    }, 850);
}

// 🗺️ 遊戲場景劇本資料庫
const scenes = {
    start: {
        text: "教室門被鎖住。講台上有個發光的東西。",
        image: "stairwell.jpg",
        choices: [
            { text: "檢查講台", nextScene: "lectern" },
            { text: "踹門", nextScene: "kick_door" }
        ]
    },
    lectern: {
        text: "你在講台上發現了一把「小教室鑰匙」！同時聽到後方傳來怪異的腳步聲...",
        image: "classroom.jpg",
        action: () => { if (!inventory.includes("小教室鑰匙")) inventory.push("小教室鑰匙"); },
        choices: [
            { text: "躲到桌子底下", nextScene: "hide" },
            { text: "拔腿衝向走廊", nextScene: "corridor" }
        ]
    },
    kick_door: {
        text: "你用力踹門，結果門紋風不動，你的腳反而一陣劇痛！(HP -10)",
        image: "stairwell.jpg",
        action: () => { hp -= 10; },
        choices: [
            { text: "冷靜下來檢查講台", nextScene: "lectern" }
        ]
    },
    hide: {
        text: "一個面目猙獰的黑影走進教室，四處張望了一下。你屏住呼吸，幸好它沒有發現你，隨後便離開了。",
        image: "classroom.jpg",
        choices: [
            { text: "等黑影走遠後潛入走廊", nextScene: "corridor" }
        ]
    },
    corridor: {
        text: "走廊陰冷。地上躺著一具穿著校長制服的屍體。",
        image: "corridor.jpg",
        choices: [
            { text: "檢查屍體", nextScene: "office" },
            { text: "進入圖書館", nextScene: "library" },
            { text: "進入儲藏室", nextScene: "storage_closed" },
            { text: "前往樓梯間", nextScene: "rooftop_locked" },
            { text: "徘徊在走廊...", nextScene: "wander" }
        ]
    },
    wander: {
        text: "你在走廊上漫無目的地閒晃，突然被天花板掉落的腐爛木板砸中！(HP -20)",
        image: "corridor.jpg",
        action: () => { hp -= 20; },
        choices: [
            { text: "趕快回神探查周遭", nextScene: "corridor" }
        ]
    },
    office: {
        text: "你在校長屍體的口袋裡搜出了一把「辦公室鑰匙」，但突然感覺到屍體的手指似乎動了一下！嚇得你心驚肉跳！(HP -10)",
        image: "office.jpg",
        action: () => { 
            hp -= 10; 
            if (!inventory.includes("辦公室鑰匙")) inventory.push("辦公室鑰匙"); 
        },
        choices: [
            { text: "撤回走廊", nextScene: "corridor" }
        ]
    },
    library: {
        text: "圖書館裡一片死寂。中央桌上放著一本翻開的日記，上面寫著：「出口的密碼藏在儲藏室的保險箱裡...」",
        image: "library.jpg",
        choices: [
            { text: "記下線索並返回走廊", nextScene: "corridor" }
        ]
    },
    storage_closed: {
        text: "儲藏室的門被鎖上了。門鎖看起來很小。",
        image: "corridor.jpg",
        choices: [
            { text: "用「小教室鑰匙」開鎖", nextScene: "storage_opened", requiredItem: "小教室鑰匙" },
            { text: "回走廊找其他線索", nextScene: "corridor" }
        ]
    },
    storage_opened: {
        text: "你成功打開了儲藏室！裡面有一個老舊的保險箱。看來需要校長室的密碼卡才能開啟...",
        image: "storage_opened.jpg",
        choices: [
            { text: "使用「辦公室鑰匙」前往校長室拿密碼", nextScene: "principal_room", requiredItem: "辦公室鑰匙" },
            { text: "先退回走廊", nextScene: "corridor" }
        ]
    },
    principal_room: {
        text: "你進入了校長室，在辦公桌的抽屜裡找到了一張「逃生密碼卡」！上面寫著：天台大門密碼 8888。",
        image: "office.jpg",
        action: () => { if (!inventory.includes("逃生密碼卡")) inventory.push("逃生密碼卡"); },
        choices: [
            { text: "帶著密碼卡衝向樓梯間", nextScene: "rooftop_locked" }
        ]
    },
    rooftop_locked: {
        text: "你來到了通往天台的大門口，鐵門上掛著一個電子密碼鎖。上面寫著：輸入密碼即可逃出生天。",
        image: "rooftop.jpg",
        choices: [
            { text: "輸入密碼 8888 逃走", nextScene: "win", requiredItem: "逃生密碼卡" },
            { text: "密碼不對或沒有密碼，退回走廊", nextScene: "corridor" }
        ]
    },
    win: {
        text: "🎉 恭喜！你成功推開天台大門，迎向了清晨的陽光！你順利逃脫了這棟恐怖校園！",
        image: "rooftop.jpg",
        choices: [] // 結束
    },
    gameover: {
        text: "💀 你的 HP 歸零了... 你的意識漸漸模糊，最終成為了這座廢棄校園裡的另一個地縛靈...",
        image: "gameover.jpg",
        choices: [
            { text: "重播命運（重新開始）", nextScene: "start" }
        ]
    }
};

// 🔄 畫面渲染核心邏輯
function updatePage(sceneKey) {
    // 1. 檢查是否死亡
    if (hp <= 0 && sceneKey !== 'gameover') {
        sceneKey = 'gameover';
    }

    const scene = scenes[sceneKey];
    if (!scene) return;

    // 2. 觸發場景特殊效果 (扣血或獲得道具)
    if (scene.action) {
        scene.action();
    }

    // 3. 如果在扣血後死亡，立刻強轉遊戲結束畫面
    if (hp <= 0 && sceneKey !== 'gameover') {
        sceneKey = 'gameover';
        updatePage('gameover');
        return;
    }

    // 4. 重設狀態欄與內文 (防止死亡後數據沒更新)
    if (sceneKey === 'start') {
        hp = 100;
        inventory = [];
    }

    // 5. 呼叫溫柔淡入淡出轉場演算法更換背景圖
    changeBackgroundSmoothly(scene.image);

    // 6. 更新狀態欄與文字內容
    document.getElementById("status-container").innerText = `HP: ${hp} | 背包: ${inventory.length > 0 ? inventory.join(', ') : '無'}`;
    document.getElementById("text-container").innerText = scene.text;

    // 7. 生成互動按鈕
    const choicesContainer = document.getElementById("choices-container");
    choicesContainer.innerHTML = ""; // 清空舊按鈕

    scene.choices.forEach(choice => {
        // 檢查玩家是否有指定道具，沒有就不顯示該選項
        if (choice.requiredItem && !inventory.includes(choice.requiredItem)) {
            return; 
        }

        const button = document.createElement("button");
        button.innerText = choice.text;
        button.addEventListener("click", () => updatePage(choice.nextScene));
        choicesContainer.appendChild(button);
    });
}

// 🚀 網頁載入完成後自動啟動遊戲
document.addEventListener("DOMContentLoaded", () => {
    // 初始化第一個場景
    updatePage("start");
});