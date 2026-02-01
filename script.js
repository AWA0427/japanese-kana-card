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
const showAllButton = document.getElementById('show-all-button');
const allCardsList = document.getElementById('all-cards-list');

// 弹窗
const settingsDialogOverlay = document.getElementById('settings-dialog-overlay');
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
let currentView = 'training';

let userSettings = {
    layout: 'vertical',
    forms: ['hiragana', 'katakana'],
    types: ['seion', 'dakuon', 'handakuon', 'youon', 'special'],
    themeColor: '#6750A4',
    isDarkMode: false
};

// --- 工具：颜色处理 ---
// 将 Hex 转换为 RGB 并计算浅色背景 (Container Color)
function updateColorVariables(hex) {
    const root = document.documentElement;
    root.style.setProperty('--primary-source', hex);
    
    // 简单的变浅算法，模拟 Material Design 的 Tonal Palette 90
    // 将 Hex 转 RGB
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt("0x" + hex[1] + hex[1]);
        g = parseInt("0x" + hex[2] + hex[2]);
        b = parseInt("0x" + hex[3] + hex[3]);
    } else if (hex.length === 7) {
        r = parseInt("0x" + hex[1] + hex[2]);
        g = parseInt("0x" + hex[3] + hex[4]);
        b = parseInt("0x" + hex[5] + hex[6]);
    }

    // 混合白色以生成 Container 颜色 (Light mode下)
    // 混合 85% 的白色
    const mixWhite = (val) => Math.round(val + (255 - val) * 0.85);
    const rC = mixWhite(r);
    const gC = mixWhite(g);
    const bC = mixWhite(b);
    
    // 深色 Container (Dark mode下混合黑色)
    const mixBlack = (val) => Math.round(val * 0.4);
    const rCD = mixBlack(r);
    const gCD = mixBlack(g);
    const bCD = mixBlack(b);

    const containerLight = `rgb(${rC}, ${gC}, ${bC})`;
    const containerDark = `rgb(${rCD}, ${gCD}, ${bCD})`;
    
    // On-Primary-Container 通常是很深的主色
    const rOn = Math.max(0, r - 100);
    const gOn = Math.max(0, g - 100);
    const bOn = Math.max(0, b - 100);
    const onContainer = `rgb(${rOn}, ${gOn}, ${bOn})`;

    // 根据当前模式设置变量
    // 这里我们设置默认(light)，Dark mode 由 CSS 里的 body.dark-mode 覆盖，或者JS动态判断
    // 为了简单，我们直接设置两个变量，CSS 中通过 body.dark-mode 选择使用
    
    // 我们直接修改全局的 container 变量，配合 body class
    if (document.body.classList.contains('dark-mode')) {
        root.style.setProperty('--primary-container', containerDark);
    } else {
        root.style.setProperty('--primary-container', containerLight);
    }
    root.style.setProperty('--on-primary-container', onContainer);
}

// --- 初始化 ---
window.onload = () => {
    applyTheme(userSettings.themeColor);
    applyLayout(userSettings.layout);
    updateKanaList();
    
    // 监听输入，控制 Placeholder 隐藏
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
    const activeForms = Array.from(document.querySelectorAll('#form-options .filter-chip.selected'))
                             .map(chip => chip.dataset.value);
    const activeTypes = Array.from(document.querySelectorAll('#type-options .filter-chip.selected'))
                             .map(chip => chip.dataset.value);

    const typeMap = {
        'seion': ['清音', '拔音'],
        'dakuon': ['浊音'],
        'handakuon': ['半浊音'],
        'youon': ['拗音'],
        'special': ['特殊假名']
    };
    const formMap = { 'hiragana': '平假名', 'katakana': '片假名' };

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
    romanjiInput.classList.remove('has-value'); // 显示 Placeholder
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
        showAllButton.textContent = 'view_cozy';
        currentView = 'training';
        if (!currentKana) nextKana();
    } else if (viewName === 'list') {
        trainingView.classList.add('hidden');
        allCardsView.classList.remove('hidden');
        showAllButton.textContent = 'arrow_back';
        renderAllCards();
        currentView = 'list';
    }
}

function renderAllCards() {
    allCardsList.innerHTML = '';
    allKana.forEach(kana => {
        const card = document.createElement('div');
        card.className = 'all-card';
        const romanjiText = Array.isArray(kana.romanji) ? kana.romanji.join(' / ') : kana.romanji;
        card.innerHTML = `<span class="kana-char">${kana.kana}</span><br><span class="romanji-char">${romanjiText}</span>`;
        allCardsList.appendChild(card);
    });
}

// --- 主题与外观 ---

function applyTheme(colorHex) {
    userSettings.themeColor = colorHex;
    updateColorVariables(colorHex); // 更新 CSS 变量，包括 Sidebar 背景
    
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
    trainingLayoutContainer.className = `training-layout layout-${layoutType}`;
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
    // 重新计算 Container 颜色 (因为深浅模式 Container 亮度不同)
    applyTheme(userSettings.themeColor);
}

// --- 事件监听 ---

inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    checkAnswer();
});

showAllButton.addEventListener('click', () => {
    if (currentView === 'training') {
        switchView('list');
    } else {
        switchView('training');
    }
});

settingsButton.addEventListener('click', () => {
    settingsDialogOverlay.classList.remove('hidden');
});

settingsDialogOverlay.addEventListener('click', (e) => {
    if (e.target === settingsDialogOverlay) {
        settingsDialogOverlay.classList.add('hidden');
    }
});

settingsApplyBtn.addEventListener('click', () => {
    toggleDarkMode(darkModeToggle.checked);
    const layoutChip = document.querySelector('#layout-options .filter-chip.selected');
    if (layoutChip) applyLayout(layoutChip.dataset.value);
    updateKanaList();
    settingsDialogOverlay.classList.add('hidden');
});

chips.forEach(chip => {
    chip.addEventListener('click', () => {
        const parent = chip.parentElement;
        if (parent.id === 'layout-options') {
            parent.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('selected'));
            chip.classList.add('selected');
        } else {
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
