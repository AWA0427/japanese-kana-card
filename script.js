// script.js

// 初始化MDC组件
mdc.autoInit();

// --- 获取DOM元素 ---
const trainingView = document.getElementById('training-view');
const allCardsView = document.getElementById('all-cards-view');
const kanaDisplay = document.getElementById('kana-display');
const romanjiInput = document.getElementById('romanji-input');
const romanjiHint = document.getElementById('romanji-hint');
const feedbackDisplay = document.getElementById('feedback-display');
const inputForm = document.getElementById('input-form');
const kanaCard = document.getElementById('kana-card');
const settingsButton = document.getElementById('settings-button');
const showAllButton = document.getElementById('show-all-button');
const backButton = document.getElementById('back-button');
const allCardsList = document.getElementById('all-cards-list');

// 获取设置弹窗和相关复选框1
const settingsDialog = new mdc.dialog.MDCDialog(document.getElementById('settings-dialog'));
const hiraganaCheckbox = document.getElementById('hiragana-checkbox');
const katakanaCheckbox = document.getElementById('katakana-checkbox');
const seionCheckbox = document.getElementById('seion-checkbox');
const dakuonCheckbox = document.getElementById('dakuon-checkbox');
const handakuonCheckbox = document.getElementById('handakuon-checkbox');
const youonCheckbox = document.getElementById('youon-checkbox');
const specialCheckbox = document.getElementById('special-checkbox');
const settingsApplyButton = document.getElementById('settings-apply-button');
const themeColorSwatches = document.querySelectorAll('.color-swatch');
const systemThemeCheckbox = document.getElementById('system-theme-checkbox');

// --- 状态变量 ---
let currentKana = null;
let filteredKanaList = [];
let unusedKanaList = [];

// --- 核心函数 ---

/**
 * 根据用户设置过滤假名列表，并初始化 unusedKanaList。
 */
function applySettings() {
    const includeHiragana = hiraganaCheckbox.checked;
    const includeKatakana = katakanaCheckbox.checked;
    const includeSeion = seionCheckbox.checked;
    const includeDakuon = dakuonCheckbox.checked;
    const includeHandakuon = handakuonCheckbox.checked;
    const includeYouon = youonCheckbox.checked;
    const includeSpecial = specialCheckbox.checked;

    let tempFilteredList = [];

    // 第一步：根据假名形式筛选 (平假名 或 片假名)
    tempFilteredList = allKana.filter(kana => {
        const formMatch = (includeHiragana && kana.form === '平假名') || (includeKatakana && kana.form === '片假名');
        return formMatch;
    });

    // 如果没有任何“假名种类”被选中，则默认包含所有假名种类。
    const noTypeSelected = !includeSeion && !includeDakuon && !includeHandakuon && !includeYouon && !includeSpecial;

    if (noTypeSelected) {
        filteredKanaList = tempFilteredList;
    } else {
        // 第二步：在已筛选的列表中，根据假名种类进行二次筛选
        filteredKanaList = tempFilteredList.filter(kana => {
            const typeMatch = (includeSeion && (kana.type === '清音' || kana.type === '拔音')) ||
                              (includeDakuon && kana.type === '浊音') ||
                              (includeHandakuon && kana.type === '半浊音') ||
                              (includeYouon && kana.type === '拗音') ||
                              (includeSpecial && kana.type === '特殊假名');
            return typeMatch;
        });
    }

    // 如果最终列表为空，则回到默认状态（所有假名）
    if (filteredKanaList.length === 0) {
        filteredKanaList = allKana;
    }

    // 将筛选后的假名列表复制到未使用列表中
    unusedKanaList = [...filteredKanaList];

    selectRandomKana();
}

/**
 * 从未使用列表中随机选择一个假名，并更新卡片显示。
 */
function selectRandomKana() {
    // 如果 unusedKanaList 为空，说明所有卡片都已出现过一遍，需要重置
    if (unusedKanaList.length === 0) {
        unusedKanaList = [...filteredKanaList];
    }
    
    if (unusedKanaList.length === 0) {
        kanaDisplay.textContent = '请在设置中选择假名';
        romanjiInput.disabled = true;
        return;
    }
    
    romanjiInput.disabled = false;
    // 从 unusedKanaList 中随机选择一个索引
    const randomIndex = Math.floor(Math.random() * unusedKanaList.length);
    // 从列表中取出假名
    currentKana = unusedKanaList[randomIndex];
    // 从 unusedKanaList 中移除该假名，确保它在一个周期内不会重复出现
    unusedKanaList.splice(randomIndex, 1);
    
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

/**
 * 切换主题颜色。
 */
function switchThemeColor(color) {
    document.documentElement.style.setProperty('--mdc-theme-primary', color);
}

/**
 * 切换亮色/深色模式。
 */
function toggleDarkMode(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// --- 事件监听器 ---

// 所有假名界面返回按钮
backButton.addEventListener('click', () => {
    switchView('training-view');
    selectRandomKana();
});

// 罗马音输入表单提交
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

settingsApplyButton.addEventListener('click', () => {
    applySettings();
    settingsDialog.close();
});

// 监听罗马音输入框的输入事件，控制提示的显示/隐藏
romanjiInput.addEventListener('input', () => {
    if (romanjiInput.value.length > 0) {
        romanjiHint.style.opacity = '0';
    } else {
        romanjiHint.style.opacity = '1';
    }
});

// 主题颜色选择
themeColorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
        const color = swatch.dataset.color;
        switchThemeColor(color);
        // 更新选中状态
        themeColorSwatches.forEach(s => s.classList.remove('selected'));
        swatch.classList.add('selected');
        systemThemeCheckbox.checked = false; // 用户手动选择颜色，取消勾选跟随系统
    });
});

// 自动切换深色模式
systemThemeCheckbox.addEventListener('change', () => {
    if (systemThemeCheckbox.checked) {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        toggleDarkMode(isDark);
        // 取消所有颜色选择器的选中状态
        themeColorSwatches.forEach(s => s.classList.remove('selected'));
    } else {
        document.body.classList.remove('dark-mode');
    }
});

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (systemThemeCheckbox.checked) {
        toggleDarkMode(e.matches);
    }
});

// 页面加载时执行
window.onload = () => {
    applySettings();
    switchView('training-view');

    // 默认选中并应用初始颜色
    const initialColorSwatch = document.querySelector('[data-color="#EFB1C9"]');
    if (initialColorSwatch) {
        initialColorSwatch.classList.add('selected');
        switchThemeColor(initialColorSwatch.dataset.color);
    }

    // 检查系统深色模式设置
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
        // 如果系统是深色模式，自动勾选并启用
        systemThemeCheckbox.checked = true;
        toggleDarkMode(true);
    }
};