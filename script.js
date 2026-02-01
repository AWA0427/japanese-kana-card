// script.js

// --- DOM 元素 ---
const trainingView = document.getElementById('training-view');
const allCardsView = document.getElementById('all-cards-view');
const kanaDisplay = document.getElementById('kana-display');
const kanaTypeHint = document.getElementById('kana-type-hint');
const romanjiInput = document.getElementById('romanji-input');
const feedbackDisplay = document.getElementById('feedback-display');
const inputForm = document.getElementById('input-form');
const kanaCard = document.getElementById('kana-card');
const skipButton = document.getElementById('skip-button');

// 导航与设置
const settingsButton = document.getElementById('settings-button');
const showAllButton = document.getElementById('show-all-button');
const backToTrainingBtn = document.getElementById('back-to-training');
const allCardsList = document.getElementById('all-cards-list');

// 弹窗
const settingsDialogOverlay = document.getElementById('settings-dialog-overlay');
const settingsApplyBtn = document.getElementById('apply-settings');
const settingsCancelBtn = document.getElementById('cancel-settings');

// 设置选项
const chips = document.querySelectorAll('.filter-chip');
const themeDots = document.querySelectorAll('.color-dot');
const customColorPicker = document.getElementById('custom-color-picker');
const systemDarkModeCheckbox = document.getElementById('system-dark-mode');

// --- 状态变量 ---
let currentKana = null;
let filteredKanaList = [];
let unusedKanaList = []; // 当前一轮未出现的
let userSettings = {
    forms: ['hiragana', 'katakana'],
    types: ['seion', 'dakuon', 'handakuon', 'youon', 'special'],
    themeColor: '#6750A4',
    followSystemTheme: true
};

// --- 初始化 ---
window.onload = () => {
    loadSettings(); // 如果有本地存储可以在这里加载
    applyTheme(userSettings.themeColor);
    checkSystemTheme();
    updateKanaList();
    
    // 默认展示
    switchView('training');
};

// --- 核心逻辑 ---

function updateKanaList() {
    // 1. 获取选中的 Form (Hiragana/Katakana)
    const activeForms = Array.from(document.querySelectorAll('#form-options .filter-chip.selected'))
                             .map(chip => chip.dataset.value);
    
    // 2. 获取选中的 Types
    const activeTypes = Array.from(document.querySelectorAll('#type-options .filter-chip.selected'))
                             .map(chip => chip.dataset.value);

    // 映射中文类型到数据中的 type 字段
    const typeMap = {
        'seion': ['清音', '拔音'],
        'dakuon': ['浊音'],
        'handakuon': ['半浊音'],
        'youon': ['拗音'],
        'special': ['特殊假名']
    };

    // 3. 过滤数据
    filteredKanaList = allKana.filter(k => {
        // 检查形态 (平假名/片假名)
        const formMap = { 'hiragana': '平假名', 'katakana': '片假名' };
        const formMatch = activeForms.some(f => k.form === formMap[f]);
        
        // 检查类型
        const typeMatch = activeTypes.some(t => typeMap[t].includes(k.type));

        return formMatch && typeMatch;
    });

    if (filteredKanaList.length === 0) {
        // 防止空列表
        alert("请至少选择一种假名类型！");
        return; // 不更新
    }

    // 重置未使用的列表
    unusedKanaList = [...filteredKanaList];
    nextKana();
}

function nextKana() {
    if (filteredKanaList.length === 0) return;

    if (unusedKanaList.length === 0) {
        // 一轮结束，重新填充
        unusedKanaList = [...filteredKanaList];
    }

    const randomIndex = Math.floor(Math.random() * unusedKanaList.length);
    currentKana = unusedKanaList[randomIndex];
    unusedKanaList.splice(randomIndex, 1);

    // UI 更新
    kanaDisplay.textContent = currentKana.kana;
    kanaTypeHint.textContent = `${currentKana.form} · ${currentKana.type}`;
    romanjiInput.value = '';
    feedbackDisplay.textContent = '';
    kanaCard.classList.remove('shake');
    romanjiInput.focus();
}

function checkAnswer() {
    if (!currentKana) return;

    const input = romanjiInput.value.trim().toLowerCase();
    const answers = Array.isArray(currentKana.romanji) ? currentKana.romanji : [currentKana.romanji];

    if (answers.includes(input)) {
        // 正确
        feedbackDisplay.textContent = "正确！";
        feedbackDisplay.style.color = "var(--success)"; // 使用 CSS 变量
        setTimeout(nextKana, 400);
    } else {
        // 错误
        feedbackDisplay.textContent = `应该是: ${answers.join(' / ')}`;
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
        if (!currentKana) nextKana();
    } else if (viewName === 'list') {
        trainingView.classList.add('hidden');
        allCardsView.classList.remove('hidden');
        renderAllCards();
    }
}

function renderAllCards() {
    allCardsList.innerHTML = '';
    // 使用全部数据，或者 filteredKanaList (这里展示全部更有用)
    allKana.forEach(k => {
        const card = document.createElement('div');
        card.className = 'md3-card-display';
        card.style.width = 'auto'; // 覆盖默认固定宽
        card.style.height = 'auto';
        card.style.padding = '10px';
        card.style.borderRadius = '16px';
        
        const romanji = Array.isArray(k.romanji) ? k.romanji[0] : k.romanji;
        
        card.innerHTML = `
            <div style="font-size: 2rem; color: var(--primary);">${k.kana}</div>
            <div style="font-size: 0.8rem; opacity: 0.6;">${romanji}</div>
        `;
        allCardsList.appendChild(card);
    });
}

// --- 主题与外观 ---

function hexToRgb(hex) {
    // 简单转换
    let c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return [(c>>16)&255, (c>>8)&255, c&255];
    }
    return [0,0,0];
}

function applyTheme(colorHex) {
    const root = document.documentElement;
    userSettings.themeColor = colorHex;
    
    // 设置主色
    root.style.setProperty('--primary-source', colorHex);
    
    // 简单的颜色计算 (模拟 Material Design 的 Tonal Palette)
    // 实际项目中推荐使用 material-color-utilities 库，这里手动模拟
    const [r, g, b] = hexToRgb(colorHex);
    
    // Container 通常是极浅的主色 (这里简单用透明度混合)
    // 这种做法在浅色模式有效，深色模式我们依靠 CSS 变量重写
    const containerColor = `rgba(${r}, ${g}, ${b}, 0.12)`; 
    // 实际上我们在 CSS 变量里定义了 hex，这里我们直接改 CSS 变量
    // 为了更好的兼容性，我们只更新 --primary 变量，让 CSS 处理其余的
    
    // 更新选中点的状态
    themeDots.forEach(dot => {
        if (dot.dataset.color.toLowerCase() === colorHex.toLowerCase()) {
            dot.classList.add('selected');
        } else {
            dot.classList.remove('selected');
        }
    });
    
    // 同步到取色器
    customColorPicker.value = colorHex;
}

function checkSystemTheme() {
    if (systemDarkModeCheckbox.checked) {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('dark-mode', isDark);
    }
}

// --- 事件监听 ---

// 1. 输入处理
inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    checkAnswer();
});

skipButton.addEventListener('click', () => {
    feedbackDisplay.textContent = `跳过: ${Array.isArray(currentKana.romanji) ? currentKana.romanji[0] : currentKana.romanji}`;
    feedbackDisplay.style.color = "var(--outline)";
    setTimeout(nextKana, 800);
});

// 2. 设置面板 Filter Chips 点击
chips.forEach(chip => {
    chip.addEventListener('click', () => {
        chip.classList.toggle('selected');
    });
});

// 3. 颜色选择
themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
        applyTheme(dot.dataset.color);
        // 如果用户手动点了颜色，可以考虑取消“跟随系统”(虽然这里不冲突，因为系统只管明暗)
    });
});

customColorPicker.addEventListener('input', (e) => {
    applyTheme(e.target.value);
    // 移除预设点的选中状态
    themeDots.forEach(d => d.classList.remove('selected'));
});

// 4. 设置弹窗控制
settingsButton.addEventListener('click', () => {
    settingsDialogOverlay.classList.remove('hidden');
    // 可以在这里重新从 userSettings 同步 UI 状态
});

settingsCancelBtn.addEventListener('click', () => {
    settingsDialogOverlay.classList.add('hidden');
    // 可以在这里回滚 UI 状态
});

settingsApplyBtn.addEventListener('click', () => {
    // 1. 应用深色模式设置
    if (systemDarkModeCheckbox.checked) {
        checkSystemTheme();
    } else {
        // 如果取消勾选，默认回浅色，或者需要记录用户手动设置的模式(这里简化为回浅色)
        document.body.classList.remove('dark-mode');
    }
    
    // 2. 更新列表
    updateKanaList();
    
    settingsDialogOverlay.classList.add('hidden');
});

// 5. 视图切换
showAllButton.addEventListener('click', () => switchView('list'));
backToTrainingBtn.addEventListener('click', () => switchView('training'));

// 6. 系统主题变更监听
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (systemDarkModeCheckbox.checked) {
        document.body.classList.toggle('dark-mode', e.matches);
    }
});
