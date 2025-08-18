// script.js

// 初始化MDC组件
mdc.autoInit();

// --- 获取DOM元素 ---
const trainingView = document.getElementById('training-view');
const allCardsView = document.getElementById('all-cards-view');
const kanaDisplay = document.getElementById('kana-display');
const romanjiInput = document.getElementById('romanji-input');
const feedbackDisplay = document.getElementById('feedback-display');
const inputForm = document.getElementById('input-form');
const kanaCard = document.getElementById('kana-card');
const settingsButton = document.getElementById('settings-button');
const showAllButton = document.getElementById('show-all-button');
const backButton = document.getElementById('back-button');
const allCardsList = document.getElementById('all-cards-list');

// 获取设置弹窗和相关复选框
const settingsDialog = new mdc.dialog.MDCDialog(document.getElementById('settings-dialog'));
const hiraganaCheckbox = document.getElementById('hiragana-checkbox');
const katakanaCheckbox = document.getElementById('katakana-checkbox');
const seionCheckbox = document.getElementById('seion-checkbox');
const dakuonCheckbox = document.getElementById('dakuon-checkbox');
const handakuonCheckbox = document.getElementById('handakuon-checkbox');
const youonCheckbox = document.getElementById('youon-checkbox');
const specialCheckbox = document.getElementById('special-checkbox');
const settingsApplyButton = document.getElementById('settings-apply-button');

// --- 状态变量 ---
let currentKana = null;
let filteredKanaList = [];

// --- 核心函数 ---

/**
 * 根据用户设置过滤假名列表。
 */
function applySettings() {
    const includeHiragana = hiraganaCheckbox.checked;
    const includeKatakana = katakanaCheckbox.checked;
    const includeSeion = seionCheckbox.checked;
    const includeDakuon = dakuonCheckbox.checked;
    const includeHandakuon = handakuonCheckbox.checked;
    const includeYouon = youonCheckbox.checked;
    const includeSpecial = specialCheckbox.checked;

    // 首先，创建一个基于所有勾选条件的假名集合
    const tempFilteredList = allKana.filter(kana => {
        // 假名形式筛选 (平假名 或 片假名)
        const formMatch = (includeHiragana && kana.form === '平假名') ||
                          (includeKatakana && kana.form === '片假名');
        
        // 假名种类筛选 (清音、浊音、半浊音、拗音)
        const typeMatch = (includeSeion && kana.type === '清音') ||
                          (includeDakuon && kana.type === '浊音') ||
                          (includeHandakuon && kana.type === '半浊音');

        // 拗音和特殊假名的精确匹配
        const youonMatch = includeYouon && kana.group === '拗音';
        const specialMatch = includeSpecial && kana.type === '特殊假名';

        // 返回所有符合任意一个“种类”条件的假名
        return formMatch && (typeMatch || youonMatch || specialMatch);
    });

    // 确保列表没有重复项，这是最后的保险措施
    filteredKanaList = [...new Set(tempFilteredList)];

    // 如果没有任何假名被勾选，则默认显示全部
    if (filteredKanaList.length === 0) {
        filteredKanaList = allKana;
    }

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
    kanaCard.style.animation = 'none';
    romanjiInput.focus();
}

/**
 * 动态生成并显示所有假名卡片。
 */
function displayAllCards() {
    allCardsList.innerHTML = '';
    allKana.forEach(kana => {
        const card = document.createElement('div');
        card.className = 'mdc-card all-card';
        const romanjiText = Array.isArray(kana.romanji) ? kana.romanji.join(' / ') : kana.romanji;
        card.innerHTML = `<span class="kana-char">${kana.kana}</span><br><span class="romanji-char">${romanjiText}</span>`;
        allCardsList.appendChild(card);
    });
}

/**
 * 切换视图。
 */
function switchView(viewId) {
    trainingView.style.display = 'none';
    allCardsView.style.display = 'none';
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.style.display = 'flex';
    }
}

// --- 事件监听器 ---

inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userInput = romanjiInput.value.toLowerCase().trim();

    const isCorrect = Array.isArray(currentKana.romanji) ? currentKana.romanji.includes(userInput) : currentKana.romanji === userInput;
    
    if (isCorrect) {
        feedbackDisplay.textContent = '正确！';
        feedbackDisplay.style.color = 'green';
        setTimeout(() => {
            selectRandomKana();
        }, 500);
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

settingsButton.addEventListener('click', () => {
    settingsDialog.open();
});

showAllButton.addEventListener('click', () => {
    switchView('all-cards-view');
    displayAllCards();
});

backButton.addEventListener('click', () => {
    switchView('training-view');
    selectRandomKana();
});

settingsApplyButton.addEventListener('click', () => {
    applySettings();
    settingsDialog.close();
});

window.onload = () => {
    applySettings();
    switchView('training-view');
};