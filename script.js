// script.js

// --- DOM 元素 ---
const trainingView = document.getElementById('training-view');
const allCardsView = document.getElementById('all-cards-view');
const kanaDisplay = document.getElementById('kana-display');
const romanjiInput = document.getElementById('romanji-input');
const feedbackDisplay = document.getElementById('feedback-display');
const inputForm = document.getElementById('input-form');
const kanaCard = document.getElementById('kana-card');
const trainingLayoutContainer = document.getElementById('training-layout-container');

// 导航
const settingsButton = document.getElementById('settings-button');
const showAllButton = document.getElementById('show-all-button'); // 现作为 Toggle 按钮
const allCardsList = document.getElementById('all-cards-list');

// 弹窗
const settingsDialogOverlay = document.getElementById('settings-dialog-overlay');
const settingsDialogContent = document.getElementById('settings-dialog-content');
const settingsApplyBtn = document.getElementById('apply-settings');

// 设置选项
const chips = document.querySelectorAll('.filter-chip');
const themeDots = document.querySelectorAll('.color-dot');
const customColorPicker = document.getElementById('custom-color-picker');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// --- 状态变量 ---
let currentKana = null;
let filteredKanaList = [];
let unusedKanaList = [];
let currentView = 'training'; // 'training' or 'list'

// 用户设置默认值
let userSettings = {
    layout: 'vertical',
    forms: ['hiragana', 'katakana'],
    types: ['seion', 'dakuon', 'handakuon', 'youon', 'special'],
    themeColor: '#6750A4',
    isDarkMode: false
};

// --- 初始化 ---
window.onload = () => {
    // 可以在这里读取 localStorage (如果有)
    applyTheme(userSettings.themeColor);
    applyLayout(userSettings.layout);
    updateKanaList();
    
    // 初始化输入框监听 (控制 placeholder)
    romanjiInput.addEventListener('input', () => {
        if (romanjiInput.value.length > 0) {
            romanjiInput.classList.add('has-value');
        } else {
            romanjiInput.classList.remove('has-value');
        }
    });

    switchView('training');
};

// --- 核心逻辑 ---

function updateKanaList() {
    // 获取表单选中的值
    const activeForms = Array.from(document.querySelectorAll('#form-options .filter-chip.selected'))
                             .map(chip => chip.dataset.value);
    const activeTypes = Array.from(document.querySelectorAll('#type-options .filter-chip.selected'))
                             .map(chip => chip.dataset.value);

    // 映射
    const typeMap = {
        'seion': ['清音', '拔音'],
        'dakuon': ['浊音'],
        'handakuon': ['半浊音'],
        'youon': ['拗音'],
        'special': ['特殊假名']
    };
    const formMap = { 'hiragana': '平假名', 'katakana': '片假名' };

    // 过滤
    filteredKanaList = allKana.filter(k => {
        const formMatch = activeForms.some(f => k.form === formMap[f]);
        const typeMatch = activeTypes.some(t => typeMap[t].includes(k.type));
        return formMatch && typeMatch;
    });

    if (filteredKanaList.length === 0) {
        alert("请至少选择一种假名类型！");
        return;
    }

    unusedKanaList = [...filteredKanaList];
    nextKana();
}

function nextKana() {
    if (filteredKanaList.length === 0) return;

    if (unusedKanaList.length === 0) {
        unusedKanaList = [...filteredKanaList];
    }

    const randomIndex = Math.floor(Math.random() * unusedKanaList.length);
    currentKana = unusedKanaList[randomIndex];
    unusedKanaList.splice(randomIndex, 1);

    kanaDisplay.textContent = currentKana.kana;
    romanjiInput.value = '';
    romanjiInput.classList.remove('has-value'); // 恢复 placeholder 显示
    feedbackDisplay.textContent = '';
    kanaCard.classList.remove('shake');
    romanjiInput.focus();
}

function checkAnswer() {
    if (!currentKana) return;

    const input = romanjiInput.value.trim().toLowerCase();
    const answers = Array.isArray(currentKana.romanji) ? currentKana.romanji : [currentKana.romanji];

    if (answers.includes(input)) {
        feedbackDisplay.textContent = "正确！";
        feedbackDisplay.style.color = "var(--success)";
        setTimeout(nextKana, 400);
    } else {
        // 修改错误提示文案
        feedbackDisplay.textContent = `错误：应为 ${answers.join(' / ')}`;
        feedbackDisplay.style.color = "var(--error)";
        kanaCard.classList.add('shake');
        setTimeout(() => kanaCard.classList.remove('shake'), 500);
    }
}

// --- 视图管理 ---

function switchView(viewName) {
    if (viewName === 'training') {
        trainingView.classList.remove('hidden');
        allCardsView.classList.add('hidden');
        showAllButton.textContent = 'view_cozy'; // 图标变回列表
        currentView = 'training';
        if (!currentKana) nextKana();
    } else if (viewName === 'list') {
        trainingView.classList.add('hidden');
        allCardsView.classList.remove('hidden');
        showAllButton.textContent = 'arrow_back'; // 图标变成返回
        renderAllCards();
        currentView = 'list';
    }
}

// 还原列表显示逻辑
function renderAllCards() {
    allCardsList.innerHTML = '';
    allKana.forEach(kana => {
        const card = document.createElement('div');
        card.className = 'all-card'; // 使用 CSS 中还原的样式
        const romanjiText = Array.isArray(kana.romanji) ? kana.romanji.join(' / ') : kana.romanji;
        card.innerHTML = `<span class="kana-char">${kana.kana}</span><br><span class="romanji-char">${romanjiText}</span>`;
        allCardsList.appendChild(card);
    });
}

// --- 主题与外观 ---

function applyTheme(colorHex) {
    userSettings.themeColor = colorHex;
    document.documentElement.style.setProperty('--primary-source', colorHex);
    
    themeDots.forEach(dot => {
        if (dot.dataset.color.toLowerCase() === colorHex.toLowerCase()) {
            dot.classList.add('selected');
        } else {
            dot.classList.remove('selected');
        }
    });
    customColorPicker.value = colorHex;
}

function applyLayout(layoutType) {
    userSettings.layout = layoutType;
    // 更新 DOM
    trainingLayoutContainer.className = `training-layout layout-${layoutType}`;
    // 更新设置面板选中状态
    document.querySelectorAll('#layout-options .filter-chip').forEach(chip => {
        if (chip.dataset.value === layoutType) {
            chip.classList.add('selected');
        } else {
            chip.classList.remove('selected');
        }
    });
}

function toggleDarkMode(isDark) {
    userSettings.isDarkMode = isDark;
    if (isDark) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// --- 事件监听 ---

inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    checkAnswer();
});

// 列表按钮 Toggle 逻辑
showAllButton.addEventListener('click', () => {
    if (currentView === 'training') {
        switchView('list');
    } else {
        switchView('training');
    }
});

// 设置弹窗逻辑
settingsButton.addEventListener('click', () => {
    settingsDialogOverlay.classList.remove('hidden');
});

// 点击遮罩层关闭弹窗
settingsDialogOverlay.addEventListener('click', (e) => {
    if (e.target === settingsDialogOverlay) {
        settingsDialogOverlay.classList.add('hidden');
    }
});

settingsApplyBtn.addEventListener('click', () => {
    // 1. 应用深色模式
    toggleDarkMode(darkModeToggle.checked);
    
    // 2. 应用布局
    const layoutChip = document.querySelector('#layout-options .filter-chip.selected');
    if (layoutChip) applyLayout(layoutChip.dataset.value);

    // 3. 更新假名列表
    updateKanaList();
    
    settingsDialogOverlay.classList.add('hidden');
});

// 设置面板内的 Chip 点击 (包括布局 Chip)
chips.forEach(chip => {
    chip.addEventListener('click', (e) => {
        const parent = chip.parentElement;
        // 如果是布局选项，实现单选逻辑
        if (parent.id === 'layout-options') {
            parent.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('selected'));
            chip.classList.add('selected');
        } else {
            // 其他选项保持多选
            chip.classList.toggle('selected');
        }
    });
});

themeDots.forEach(dot => {
    dot.addEventListener('click', () => applyTheme(dot.dataset.color));
});

customColorPicker.addEventListener('input', (e) => {
    applyTheme(e.target.value);
    themeDots.forEach(d => d.classList.remove('selected'));
});
