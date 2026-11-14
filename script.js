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
const topAppBar = document.querySelector('.md3-top-app-bar');
const mainScaffold = document.querySelector('.main-scaffold');

// 列表缩放
const listZoomSlider = document.getElementById('list-zoom');
const listZoomLabel = document.getElementById('list-zoom-label');

// 弹窗
const settingsDialogOverlay = document.getElementById('settings-dialog-overlay');
const settingsApplyBtn = document.getElementById('apply-settings');
const settingsResetBtn = document.getElementById('reset-settings');

// Material 波纹：按压点为中心扩散一圈淡色涟漪
function attachRipple(el) {
    el.addEventListener('pointerdown', (e) => {
        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        el.appendChild(ripple);
        setTimeout(() => ripple.remove(), 500);
    });
}
document.querySelectorAll('.md3-icon-button, .md3-button-filled, .filter-chip, .segmented-button, .md3-text-button')
        .forEach(attachRipple);

// 设置选项（布局方向是分段按钮；假名模式/种类是筛选芯片；色板分主/次两个角色）
const chips = document.querySelectorAll('#form-options .filter-chip, #type-options .filter-chip');
const layoutSegments = document.querySelectorAll('#layout-options .segmented-button');
const colorRoles = {
    primary: {
        dots: document.querySelectorAll('#primary-color-options .color-dot:not(.custom-dot)'),
        customDot: document.getElementById('custom-primary-dot'),
        picker: document.getElementById('custom-color-picker')
    },
    secondary: {
        dots: document.querySelectorAll('#secondary-color-options .color-dot:not(.custom-dot)'),
        customDot: document.getElementById('custom-secondary-dot'),
        picker: document.getElementById('custom-secondary-picker')
    }
};
const darkModeToggle = document.getElementById('dark-mode-toggle');

// --- 状态变量 ---
let currentKana = null;
let filteredKanaList = [];
let unusedKanaList = [];
let currentView = 'training';

// 恢复默认按钮的目标状态（与 userSettings 初始值保持一致）
const DEFAULT_SETTINGS = {
    layout: 'vertical',
    forms: ['hiragana', 'katakana'],
    types: ['seion', 'dakuon', 'handakuon', 'youon', 'special'],
    themeColor: '#6750A4',
    secondaryColor: '#6750A4',
    isDarkMode: false,
    listZoom: 100
};

let userSettings = {
    layout: 'vertical',
    forms: ['hiragana', 'katakana'],
    types: ['seion', 'dakuon', 'handakuon', 'youon', 'special'],
    themeColor: '#6750A4',      // 主强调色：顶栏 / 按钮 / 开关
    secondaryColor: '#6750A4',  // 次强调色：选中芯片 / 分段按钮
    isDarkMode: false
};

// --- 工具：颜色处理 ---
function hexToRgb(hex) {
    return [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
}
const rgbStr = (c) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
const mixRgb = (c, target, t) => c.map((v, i) => Math.round(v * (1 - t) + target[i] * t));
const WHITE = [255, 255, 255], BLACK = [0, 0, 0];

// 估算颜色亮度，决定色块上的勾选图标用白色还是深色，保证任何底色下都清晰
function isLightColor(hex) {
    const [r, g, b] = hexToRgb(hex);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

// 由主/次强调色推导全部主题变量（表面色、容器色），深浅色模式各算一套。
// 这些变量统一挂在 <html> 内联样式上，CSS 中严禁在 body.dark-mode 里写同名覆盖，
// 否则 body 上的声明会覆盖 html 的内联值（“深色模式强制变回紫色”的根因）。
function updateThemeVariables() {
    const root = document.documentElement;
    const p = hexToRgb(userSettings.themeColor);
    const s = hexToRgb(userSettings.secondaryColor);

    root.style.setProperty('--primary-source', userSettings.themeColor);
    root.style.setProperty('--secondary-source', userSettings.secondaryColor);

    if (!userSettings.isDarkMode) {
        root.style.setProperty('--primary-container', rgbStr(mixRgb(p, WHITE, 0.90)));
        root.style.setProperty('--on-primary-container', rgbStr(mixRgb(p, BLACK, 0.55)));
        root.style.setProperty('--secondary-container', rgbStr(mixRgb(s, WHITE, 0.90)));
        root.style.setProperty('--on-secondary-container', rgbStr(mixRgb(s, BLACK, 0.55)));
        // 背景随主强调色带出可感知的同色调浅晕（不碰假名卡片自身的白底）
        root.style.setProperty('--surface', rgbStr(mixRgb(p, WHITE, 0.94)));
        root.style.setProperty('--surface-container', rgbStr(mixRgb(p, WHITE, 0.90)));
        root.style.setProperty('--surface-container-high', rgbStr(mixRgb(p, WHITE, 0.86)));
    } else {
        // 深色容器只混 25% 黑：保持鲜亮，避免出现灰暗的“墨色”选中态
        root.style.setProperty('--primary-container', rgbStr(mixRgb(p, BLACK, 0.25)));
        root.style.setProperty('--on-primary-container', rgbStr(mixRgb(p, WHITE, 0.92)));
        root.style.setProperty('--secondary-container', rgbStr(mixRgb(s, BLACK, 0.25)));
        root.style.setProperty('--on-secondary-container', rgbStr(mixRgb(s, WHITE, 0.92)));
        const base = [18, 17, 22];
        root.style.setProperty('--surface', rgbStr(mixRgb(base, p, 0.05)));
        root.style.setProperty('--surface-container', rgbStr(mixRgb([29, 27, 32], p, 0.10)));
        root.style.setProperty('--surface-container-high', rgbStr(mixRgb([43, 41, 48], p, 0.12)));
    }
}

// 同步某个颜色角色的色板 UI：命中预设 → 勾选该预设；否则激活“自定义”色块
function syncRoleDots(role, hex) {
    const { dots, customDot, picker } = colorRoles[role];
    const normalized = hex.toLowerCase();
    let matchedPreset = false;

    dots.forEach(dot => {
        const isSelected = dot.dataset.color.toLowerCase() === normalized;
        dot.classList.toggle('selected', isSelected);
        dot.querySelector('.material-symbols-rounded')
           .classList.toggle('light-text', isLightColor(dot.dataset.color));
        if (isSelected) matchedPreset = true;
    });

    if (matchedPreset) {
        customDot.classList.remove('selected', 'is-active');
        customDot.title = '自定义颜色';
    } else {
        customDot.classList.add('selected', 'is-active');
        customDot.style.setProperty('--swatch', hex);
        customDot.querySelector('.icon-check')
                 .classList.toggle('light-text', isLightColor(hex));
        customDot.title = `自定义颜色 ${hex}`;
    }
    picker.value = hex;
}

function applyColorRole(role, hex) {
    if (role === 'primary') userSettings.themeColor = hex;
    else userSettings.secondaryColor = hex;
    updateThemeVariables();
    syncRoleDots(role, hex);
}

// --- 初始化 ---
// DOM 就绪立即绑定事件并初始化，不再等待字体等外部资源
// （此前用 window.onload，Google Fonts 慢时所有按钮会失灵 1-2 秒）
function initApp() {
    applyColorRole('primary', userSettings.themeColor);
    applyColorRole('secondary', userSettings.secondaryColor);
    applyLayout(userSettings.layout);
    updateKanaList();

    // Google 式滚动海拔：内容区滚动后顶栏浮起
    mainScaffold.addEventListener('scroll', () => {
        topAppBar.classList.toggle('scrolled', mainScaffold.scrollTop > 4);
    }, { passive: true });

    // 列表缩放滑杆：只改基础卡片宽度，卡片内部比例由 cqi 自动保持
    listZoomSlider.addEventListener('input', () => {
        const v = Number(listZoomSlider.value);
        document.documentElement.style.setProperty('--list-zoom', String(v / 100));
        listZoomLabel.textContent = v + '%';
    });
    
    // 监听输入，控制 Placeholder 隐藏（作为辅助，主要靠 CSS :focus）
    romanjiInput.addEventListener('input', () => {
        if (romanjiInput.value.length > 0) {
            romanjiInput.classList.add('has-value');
        } else {
            romanjiInput.classList.remove('has-value');
        }
    });

    switchView('training');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

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

    if (filteredKanaList.length === 0) return; // 分组守卫已保证至少选一项，这里仅作兜底

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

    // 关键修复：先聚焦，确立 :focus 状态
    // 设置弹窗打开或处于列表视图时不抢焦点，关闭弹窗后由“完成”按钮交还焦点
    if (settingsDialogOverlay.classList.contains('hidden') && currentView === 'training') {
        romanjiInput.focus();
    }

    // 再清空内容，此时 :focus 生效，placeholder 保持隐藏
    romanjiInput.value = '';
    romanjiInput.classList.remove('has-value');
    
    feedbackDisplay.textContent = '';
    kanaCard.classList.remove('shake');
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
        trainingView.classList.add('hidden');
        allCardsView.classList.add('hidden');
        void trainingView.offsetWidth; // 重置过渡起点
        trainingView.classList.remove('hidden');
        showAllButton.textContent = 'view_cozy';
        currentView = 'training';
        popViewIcon();
        if (!currentKana) nextKana();
    } else if (viewName === 'list') {
        trainingView.classList.add('hidden');
        allCardsView.classList.remove('hidden');
        showAllButton.textContent = 'arrow_back';
        popViewIcon();
        renderAllCards();
        currentView = 'list';
    }
}

// 图标切换时的弹性入场动效
function popViewIcon() {
    showAllButton.classList.remove('icon-pop');
    void showAllButton.offsetWidth; // 强制重排以重启动画
    showAllButton.classList.add('icon-pop');
}

function renderAllCards() {
    allCardsList.innerHTML = '';
    // 跟随设置中的筛选范围，保证“列表预览”与训练内容一致
    const listToShow = filteredKanaList.length ? filteredKanaList : allKana;
    listToShow.forEach(kana => {
        const card = document.createElement('div');
        card.className = 'all-card';
        const romanjiText = Array.isArray(kana.romanji) ? kana.romanji.join(' / ') : kana.romanji;
        card.innerHTML = `<span class="kana-char">${kana.kana}</span><br><span class="romanji-char">${romanjiText}</span>`;
        allCardsList.appendChild(card);
    });
}

// --- 主题与外观 ---

function applyLayout(layoutType) {
    userSettings.layout = layoutType;
    trainingLayoutContainer.className = `training-layout layout-${layoutType}`;
    layoutSegments.forEach(btn => {
        const isSelected = btn.dataset.value === layoutType;
        btn.classList.toggle('selected', isSelected);
        btn.setAttribute('aria-checked', String(isSelected));
    });
}

function toggleDarkMode(isDark) {
    userSettings.isDarkMode = isDark;
    document.body.classList.toggle('dark-mode', isDark);
    // 重新推导表面色/容器色（主题变量只挂在内联样式上，深浅模式互不覆盖）
    updateThemeVariables();
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
        // 返回训练视图时接管焦点，Placeholder 保持隐藏、可直接输入
        romanjiInput.focus();
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
    settingsDialogOverlay.classList.add('hidden');
    // 关闭弹窗后把焦点交还输入框，保证 Placeholder 隐藏逻辑无缝衔接
    if (currentView === 'training') romanjiInput.focus();
});

// 恢复默认：全部设置回到初始状态并实时生效（刷新页面本来也会遗忘，这里只是免手动）
settingsResetBtn.addEventListener('click', () => {
    applyLayout(DEFAULT_SETTINGS.layout);

    document.querySelectorAll('#form-options .filter-chip').forEach(chip => {
        const on = DEFAULT_SETTINGS.forms.includes(chip.dataset.value);
        chip.classList.toggle('selected', on);
        chip.setAttribute('aria-pressed', String(on));
    });
    document.querySelectorAll('#type-options .filter-chip').forEach(chip => {
        const on = DEFAULT_SETTINGS.types.includes(chip.dataset.value);
        chip.classList.toggle('selected', on);
        chip.setAttribute('aria-pressed', String(on));
    });

    darkModeToggle.checked = DEFAULT_SETTINGS.isDarkMode;
    toggleDarkMode(DEFAULT_SETTINGS.isDarkMode);
    applyColorRole('primary', DEFAULT_SETTINGS.themeColor);
    applyColorRole('secondary', DEFAULT_SETTINGS.secondaryColor);

    listZoomSlider.value = DEFAULT_SETTINGS.listZoom;
    listZoomSlider.dispatchEvent(new Event('input'));

    updateKanaList();
});

// 分段按钮：单选，选择后立即生效
layoutSegments.forEach(btn => {
    btn.addEventListener('click', () => applyLayout(btn.dataset.value));
});

// 筛选芯片：多选，选择后立即生效；每组至少保留一项
chips.forEach(chip => {
    chip.addEventListener('click', () => {
        const group = chip.closest('.chip-set');
        const selectedCount = group.querySelectorAll('.filter-chip.selected').length;

        if (chip.classList.contains('selected') && selectedCount <= 1) {
            // 不允许清空整组：抖动 + 错误色一闪代替 alert
            chip.classList.add('deny');
            setTimeout(() => chip.classList.remove('deny'), 350);
            return;
        }

        chip.classList.toggle('selected');
        chip.setAttribute('aria-pressed', String(chip.classList.contains('selected')));
        updateKanaList();
    });
});

// 主/次强调色：预设色点、自定义色块、原生取色器三件套，按角色各自绑定
Object.entries(colorRoles).forEach(([role, conf]) => {
    conf.dots.forEach(dot => {
        dot.addEventListener('click', () => applyColorRole(role, dot.dataset.color));
    });
    conf.customDot.addEventListener('click', () => conf.picker.click());
    conf.picker.addEventListener('input', (e) => applyColorRole(role, e.target.value));
});

// 深色模式：拨动立即生效，与颜色/芯片保持同一套“实时预览”模型
darkModeToggle.addEventListener('change', () => toggleDarkMode(darkModeToggle.checked));

// ESC 关闭设置弹窗
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') settingsDialogOverlay.classList.add('hidden');
});
