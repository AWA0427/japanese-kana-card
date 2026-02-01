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
function updateColorVariables(hex) {
    const root = document.documentElement;
    root.style.setProperty('--primary-source', hex);
    
    // 解析 HEX
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

    // 计算 Container 颜色
    // 浅色模式：混合大量白色 (90%)
    const mix = (c, w, p) => Math.round(c * (1 - p) + w * p);
    const rL = mix(r, 255, 0.90);
    const gL = mix(g, 255, 0.90);
    const bL = mix(b, 255, 0.90);
    const containerLight = `rgb(${rL}, ${gL}, ${bL})`;
    
    // 深色模式：混合一些灰色/黑色，或者是低饱和度的主色
    // 简单做法：降低亮度，保持色相
    const rD = mix(r, 0, 0.6); // 变暗
    const gD = mix(g, 0, 0.6);
    const bD = mix(b, 0, 0.6);
    const containerDark = `rgb(${rD}, ${gD}, ${bD})`;

    // On-Primary-Container (文字颜色)
    // 浅色模式下是深色文字
    const rOnL = mix(r, 0, 0.6); 
    const gOnL = mix(g, 0, 0.6); 
    const bOnL = mix(b, 0, 0.6); 
    const onContainerLight = `rgb(${rOnL}, ${gOnL}, ${bOnL})`;

    // 深色模式下是浅色文字
    const onContainerDark = `rgb(${rL}, ${gL}, ${bL})`;

    // 应用变量
    // 我们同时定义 light 和 dark 的变量，由 body 类名决定使用的具体颜色
    // 但为了确保 CSS 变量能被读取，我们直接根据当前状态设置 --primary-container
    if (userSettings.isDarkMode) {
        root.style.setProperty('--primary-container', containerDark);
        root.style.setProperty('--on-primary-container', onContainerDark);
    } else {
        root.style.setProperty('--primary-container', containerLight);
        root.style.setProperty('--on-primary-container', onContainerLight);
    }
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
    updateColorVariables(colorHex); 
    
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
    // 重新计算颜色，因为深浅模式的 Container 计算方式不同
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
