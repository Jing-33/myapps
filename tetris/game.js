// ==========================================
// 1. 初始化畫布與環境設定
// ==========================================
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20); // 將畫布放大 20 倍 (主畫面 12x24 格子)

const nextCanvas = document.getElementById('next');
const nextContext = nextCanvas.getContext('2d');
nextContext.scale(24, 24); // 預覽視窗

// 7 種方塊的電競霓虹配色
const COLORS = [
    null,
    '#ff0055', // 1: T (極致粉紅)
    '#00f0ff', // 2: I (青色霓虹)
    '#00ff66', // 3: S (螢光綠)
    '#ff00ff', // 4: Z (魔幻紫)
    '#ff9900', // 5: L (亮橘)
    '#ffea00', // 6: J (鮮黃)
    '#2979ff', // 7: O (電子藍)
];

// 定義七種經典方塊形狀的矩陣 (1-7 代表對應顏色)
function createPiece(type) {
    if (type === 'I') return [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]];
    if (type === 'L') return [[0,2,0],[0,2,0],[0,2,2]];
    if (type === 'J') return [[0,3,0],[0,3,0],[3,3,0]];
    if (type === 'O') return [[4,4],[4,4]];
    if (type === 'Z') return [[5,5,0],[0,5,5],[0,0,0]];
    if (type === 'S') return [[0,6,6],[6,6,0],[0,0,0]];
    if (type === 'T') return [[0,7,0],[7,7,7],[0,0,0]];
}

// 建立二維陣列遊戲地圖 (12 寬 x 24 高)
function createMatrix(w, h) {
    const matrix = [];
    while (h--) { matrix.push(new Array(w).fill(0)); }
    return matrix;
}
let arena = createMatrix(12, 24);

// 玩家狀態
const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    nextMatrix: null,
    score: 0,
    highScore: parseInt(localStorage.getItem('tetris_highscore')) || 0, // 💡 從本地儲存載入最高分數
    level: 1
};

// ==========================================
// 2. 💡 遊戲核心狀態控制變數 (新增全域安全鎖)
// ==========================================
let isPaused = false;
let isGameOver = false;     // 用來鎖定死後操作
let clearedRows = [];       // 紀錄目前正在閃爍消除的行號
let flashTimer = 0;         // 閃爍特效計時器
const FLASH_DURATION = 150; // 閃爍持續時間

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let animFrameId = null;     // 用來精準掐死 RequestAnimationFrame 動態迴圈

// ==========================================
// 3. Web Audio API 音效產生器
// ==========================================
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playSound(type) {
    if (!audioCtx) return; 
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'move') {
            osc.type = 'square'; 
            osc.frequency.setValueAtTime(150, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
            osc.start(); osc.stop(audioCtx.currentTime + 0.05);
        } 
        else if (type === 'rotate') {
            osc.type = 'triangle'; 
            osc.frequency.setValueAtTime(280, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
            osc.start(); osc.stop(audioCtx.currentTime + 0.08);
        } 
        else if (type === 'drop') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(90, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.start(); osc.stop(audioCtx.currentTime + 0.1);
        } 
        else if (type === 'clear') {
            osc.type = 'square';
            const now = audioCtx.currentTime;
            osc.frequency.setValueAtTime(350, now);
            osc.frequency.setValueAtTime(500, now + 0.08);
            osc.frequency.setValueAtTime(800, now + 0.16);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(); osc.stop(now + 0.3);
        } 
        else if (type === 'gameover') {
            osc.type = 'sawtooth'; 
            const now = audioCtx.currentTime;
            osc.frequency.setValueAtTime(250, now);
            osc.frequency.linearRampToValueAtTime(80, now + 0.6);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
            osc.start(); osc.stop(now + 0.6);
        }
    } catch (e) { console.log('音效撥放略過'); }
}

// ==========================================
// 4. 畫面渲染與繪製
// ==========================================
function drawMatrix(matrix, offset, ctx = context) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                ctx.fillStyle = COLORS[value];
                ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
                
                ctx.strokeStyle = '#090d16';
                ctx.lineWidth = 0.06;
                ctx.strokeRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function draw() {
    context.fillStyle = '#090d16';
    context.fillRect(0, 0, canvas.width, canvas.height);

    arena.forEach((row, y) => {
        const isRowFlashing = clearedRows.includes(y);
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = isRowFlashing ? '#ffffff' : COLORS[value];
                context.fillRect(x, y, 1, 1);
                
                context.strokeStyle = '#090d16';
                context.lineWidth = 0.06;
                context.strokeRect(x, y, 1, 1);
            }
        });
    });

    if (clearedRows.length === 0 && player.matrix) {
        drawMatrix(player.matrix, player.pos);
    }
}

function drawNext() {
    nextContext.fillStyle = '#090d16';
    nextContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

    if (!player.nextMatrix) return;
    const nMatrix = player.nextMatrix;
    const xOffset = (4 - nMatrix[0].length) / 2;
    const yOffset = (4 - nMatrix.length) / 2;

    drawMatrix(nMatrix, {x: xOffset, y: yOffset}, nextContext);
}

// 💡 修正：動態判斷並同步更新最高紀錄
function updateScore() {
    if (player.score > player.highScore) {
        player.highScore = player.score;
        localStorage.setItem('tetris_highscore', player.highScore); // 儲存到瀏覽器
    }
    document.getElementById('score').innerText = player.score;
    document.getElementById('high-score').innerText = player.highScore;
    document.getElementById('level').innerText = player.level;
}

function togglePause() {
    if (isGameOver) return; 
    isPaused = !isPaused;
    const pauseScreen = document.getElementById('pause-screen');
    if (pauseScreen) {
        if (isPaused) pauseScreen.classList.remove('hidden');
        else pauseScreen.classList.add('hidden');
    }
}

// ==========================================
// 5. 💡 彈出視窗控制邏輯
// ==========================================
function showGameOverModal() {
    isGameOver = true;
    
    if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
    }
    
    playSound('gameover');

    // 把分數與最高紀錄寫進彈出視窗
    document.getElementById('modal-score').innerText = player.score;
    document.getElementById('modal-high-score').innerText = player.highScore;
    document.getElementById('modal-level').innerText = player.level;

    const modal = document.getElementById('gameover-modal');
    const box = document.getElementById('gameover-box');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        box.classList.remove('scale-95');
    }, 20);
}

function closeGameOverModal() {
    const modal = document.getElementById('gameover-modal');
    const box = document.getElementById('gameover-box');
    modal.classList.add('opacity-0');
    box.classList.add('scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
        
        arena.forEach(row => row.fill(0));
        player.score = 0;
        player.level = 1;
        dropInterval = 1000;
        dropCounter = 0;
        isGameOver = false;
        isPaused = false;
        
        player.matrix = null;
        player.nextMatrix = null;
        
        updateScore();
        playerReset();
        
        lastTime = performance.now();
        if (animFrameId) cancelAnimationFrame(animFrameId);
        animFrameId = requestAnimationFrame(update);
    }, 300);
}

// ==========================================
// 6. 物理、碰撞與移動邏輯
// ==========================================
function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) { 
                return true; 
            }
        }
    }
    return false;
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) { 
                arena[y + player.pos.y][x + player.pos.x] = value; 
            }
        });
    });
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) { [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]]; }
    }
    if (dir > 0) { matrix.forEach(row => row.reverse()); } else { matrix.reverse(); }
}

function playerRotate(dir) {
    if (isPaused || isGameOver || clearedRows.length > 0) return;
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
    playSound('rotate');
}

function playerDrop() {
    if (isPaused || isGameOver || clearedRows.length > 0) return;
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playSound('drop');
        
        checkLines(); 
        
        if (clearedRows.length === 0) {
            playerReset();
        }
    }
    dropCounter = 0;
}

function playerHardDrop() {
    if (isPaused || isGameOver || clearedRows.length > 0) return;
    let steps = 0;
    while (!collide(arena, player)) {
        player.pos.y++;
        steps++;
    }
    player.pos.y--;
    if (steps > 0) playSound('drop');
    
    merge(arena, player);
    checkLines();
    if (clearedRows.length === 0) {
        playerReset();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    if (isPaused || isGameOver || clearedRows.length > 0 || !player.matrix) return;
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    } else {
        playSound('move');
    }
}

function getRandomPiece() {
    const pieces = 'ILJOSZT';
    return createPiece(pieces[pieces.length * Math.random() | 0]);
}

function playerReset() {
    if (isGameOver) return;

    if (!player.nextMatrix) {
        player.matrix = getRandomPiece();
        player.nextMatrix = getRandomPiece();
    } else {
        player.matrix = player.nextMatrix;
        player.nextMatrix = getRandomPiece();
    }

    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
    
    if (collide(arena, player)) {
        showGameOverModal();
        return;
    }
    drawNext();
}

// ==========================================
// 7. 消行編排與計分機制邏輯
// ==========================================
function checkLines() {
    clearedRows = [];
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) continue outer;
        }
        clearedRows.push(y); 
    }
    if (clearedRows.length > 0) {
        playSound('clear');
        flashTimer = 0; 
    }
}

function arenaSweep() {
    let rowCount = 1;
    clearedRows.sort((a, b) => a - b).forEach(y => {
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row); 
        
        player.score += rowCount * 10;
        rowCount *= 2; 
    });

    if (player.score >= player.level * 50) {
        player.level++;
        dropInterval = Math.max(100, 1000 - (player.level * 80));
    }
    
    clearedRows = []; 
    playerReset();     
    updateScore();
}

// ==========================================
// 8. 遊戲主迴圈與監聽事件
// ==========================================
function update(time = 0) {
    if (isGameOver) return;

    const deltaTime = time - lastTime;
    lastTime = time;

    if (!isPaused) {
        if (clearedRows.length > 0) {
            flashTimer += deltaTime;
            if (flashTimer >= FLASH_DURATION) {
                arenaSweep(); 
            }
        } else {
            dropCounter += deltaTime;
            if (dropCounter > dropInterval) {
                playerDrop();
            }
        }
    }

    draw();
    animFrameId = requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
    initAudio();

    if (event.keyCode === 80) { // P 鍵：暫停
        togglePause();
        return;
    }

    if (isPaused || isGameOver) return; 

    if (event.keyCode === 37) {        // ⬅️ 左移
        playerMove(-1);
    } else if (event.keyCode === 39) { // ➡️ 右移
        playerMove(1);
    } else if (event.keyCode === 40) { // ⬇️ 加速下落
        playerDrop();
    } else if (event.keyCode === 38) { // ⬆️ 旋轉
        playerRotate(1);
    } else if (event.keyCode === 32) { // Space 空白鍵：瞬降
        playerHardDrop();
    }
});

document.addEventListener('click', () => {
    initAudio();
}, { once: true });

// 依序執行啟動
playerReset();
updateScore();
lastTime = performance.now();
animFrameId = requestAnimationFrame(update);