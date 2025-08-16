// script.js

// 初始化MDC组件
mdc.autoInit();

// --- 获取DOM元素 ---
const kanaDisplay = document.getElementById('kana-display');
const romanjiInput = document.getElementById('romanji-input');
const feedbackDisplay = document.getElementById('feedback-display');
const inputForm = document.getElementById('input-form');
const kanaCard = document.getElementById('kana-card');
const settingsButton = document.getElementById('settings-button');

// 获取设置弹窗和相关复选框
const settingsDialog = new mdc.dialog.MDCDialog(document.getElementById('settings-dialog'));
const hiraganaCheckbox = document.getElementById('hiragana-checkbox');
const katakanaCheckbox = document.getElementById('katakana-checkbox');
const seionCheckbox = document.getElementById('seion-checkbox');
const dakuonCheckbox = document.getElementById('dakuon-checkbox');
const handakuonCheckbox = document.getElementById('handakuon-checkbox');
const specialCheckbox = document.getElementById('special-checkbox');
const youonCheckbox = document.getElementById('youon-checkbox'); // 拗音复选框
const settingsApplyButton = document.getElementById('settings-apply-button');

// --- 状态变量 ---
let currentKana = null;
let filteredKanaList = []; // 初始为空，由 applySettings 填充

// --- 核心函数 ---

/**
 * 根据用户设置过滤假名列表。
 */
function applySettings() {
    // 获取所有复选框的状态
    const includeHiragana = hiraganaCheckbox.checked;
    const includeKatakana = katakanaCheckbox.checked;
    const includeSeion = seionCheckbox.checked;
    const includeDakuon = dakuonCheckbox.checked;
    const includeHandakuon = handakuonCheckbox.checked;
    const includeSpecial = specialCheckbox.checked;
    const includeYouon = youonCheckbox.checked;

    // 过滤假名列表
    filteredKanaList = allKana.filter(kana => {
        // 1. 根据假名形式（平假名/片假名）过滤
        const formMatch = (includeHiragana && kana.form === '平假名') ||
                          (includeKatakana && kana.form === '片假名');
        
        // 2. 根据假名类型（清音/浊音等）过滤
        const typeMatch = (includeSeion && kana.type === '清音') ||
                          (includeDakuon && kana.type === '浊音') ||
                          (includeHandakuon && kana.type === '半浊音') ||
                          (includeSpecial && kana.type === '特殊假名'); // 修正为 '特殊假名'

        // 3. 拗音是一个特殊的“组”，需要单独处理
        const isYouon = kana.group === '拗音';
        if (isYouon) {
            return includeYouon && formMatch && typeMatch;
        }

        return formMatch && typeMatch;
    });

    // 如果没有任何假名被选中，则默认包含所有假名
    if (filteredKanaList.length === 0) {
        filteredKanaList = allKana;
    }

    // 更新界面
    selectRandomKana();
}

/**
 * 从过滤后的列表中随机选择一个假名，并更新卡片显示。
 */
function selectRandomKana() {
    if (filteredKanaList.length === 0) {
        kanaDisplay.textContent = '请在设置中选择假名';
        romanjiInput.disabled = true;
        return;
    }
    romanjiInput.disabled = false;
    const randomIndex = Math.floor(Math.random() * filteredKanaList.length);
    currentKana = filteredKanaList[randomIndex];
    kanaDisplay.textContent = currentKana.kana;
    romanjiInput.value = '';
    feedbackDisplay.textContent = '';
    kanaCard.style.animation = 'none'; // 重置震动动画
}

// --- 事件监听器 ---

// 检查用户输入
inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userInput = romanjiInput.value.toLowerCase().trim();

    // 检查用户输入是否在正确罗马音的数组中
    const isCorrect = Array.isArray(currentKana.romanji) ? currentKana.romanji.includes(userInput) : currentKana.romanji === userInput;
    
    if (isCorrect) {
        feedbackDisplay.textContent = '正确！';
        feedbackDisplay.style.color = 'green';
        setTimeout(() => {
            selectRandomKana();
        }, 1000);
    } else {
        const correctRomanji = Array.isArray(currentKana.romanji) ? currentKana.romanji.join(' / ') : currentKana.romanji;
        feedbackDisplay.textContent = `错误！正确读音: ${correctRomanji}`;
        feedbackDisplay.style.color = 'red';
        kanaCard.style.animation = 'shake 0.3s';
        if ('vibrate' in navigator) {
            navigator.vibrate(200);
        }
    }
});

// 打开设置弹窗
settingsButton.addEventListener('click', () => {
    settingsDialog.open();
});

// 为设置弹窗的“应用”按钮添加监听器
settingsApplyButton.addEventListener('click', () => {
    applySettings();
    settingsDialog.close();
});


// 页面加载时开始
window.onload = () => {
    // 默认选中所有复选框，然后应用设置
    hiraganaCheckbox.checked = true;
    katakanaCheckbox.checked = true;
    seionCheckbox.checked = true;
    dakuonCheckbox.checked = true;
    handakuonCheckbox.checked = true;
    specialCheckbox.checked = true;
    youonCheckbox.checked = true;
    applySettings();
};
