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
// 模式切换
const modeChips = document.querySelectorAll('#mode-options .filter-chip');

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
  isDarkMode: false,
  trainingMode: 'forward', // 'forward' = 看假名写罗马字, 'reverse' = 看罗马字写假名
  reverseKanaForm: 'hiragana' // 逆向模式下用户选择的假名类型: 'hiragana' 或 'katakana'
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

  // 使用更合理的颜色混合算法 (Material Design 风格)
  // 计算色相饱和度以生成协调的容器颜色
  const toHSL = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const toRGB = (h, s, l) => {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  };

  const hsl = toHSL(r, g, b);

  // 浅色模式：增加亮度，降低饱和度
  const lightL = Math.min(hsl.l + 45, 98);
  const lightS = Math.max(hsl.s - 20, 10);
  const lightRGB = toRGB(hsl.h, lightS, lightL);
  const containerLight = `rgb(${lightRGB.r}, ${lightRGB.g}, ${lightRGB.b})`;

  // 深色容器文字颜色（深色背景上的浅色文字）
  const onContainerLightR = Math.round(lightRGB.r * 0.15);
  const onContainerLightG = Math.round(lightRGB.g * 0.15);
  const onContainerLightB = Math.round(lightRGB.b * 0.15 + 30);
  const onContainerLight = `rgb(${onContainerLightR}, ${onContainerLightG}, ${onContainerLightB})`;

  // 深色模式：降低亮度
  const darkL = Math.max(hsl.l - 35, 15);
  const darkRGB = toRGB(hsl.h, Math.min(hsl.s + 10, 100), darkL);
  const containerDark = `rgb(${darkRGB.r}, ${darkRGB.g}, ${darkRGB.b})`;

  // 深色容器文字颜色（深色背景上的浅色文字）
  const onContainerDarkL = Math.min(darkL + 55, 92);
  const onContainerDarkRGB = toRGB(hsl.h, lightS, onContainerDarkL);
  const onContainerDark = `rgb(${onContainerDarkRGB.r}, ${onContainerDarkRGB.g}, ${onContainerDarkRGB.b})`;

  if (userSettings.isDarkMode) {
    root.style.setProperty('--primary-container', containerDark);
    root.style.setProperty('--on-primary-container', onContainerDark);
  } else {
    root.style.setProperty('--primary-container', containerLight);
    root.style.setProperty('--on-primary-container', onContainerLight);
  }
}

// --- 更新输入框占位符 ---
function updateInputPlaceholder() {
  const placeholder = document.getElementById('input-placeholder');
  if (userSettings.trainingMode === 'forward') {
    placeholder.textContent = '输入罗马音';
    romanjiInput.removeAttribute('inputmode');
    romanjiInput.removeAttribute('lang');
  } else {
    // 逆向模式：需要日语输入
    placeholder.textContent = '输入假名';
    romanjiInput.setAttribute('inputmode', 'text');
    romanjiInput.setAttribute('lang', 'ja');
  }
}

// --- 初始化 ---
window.onload = () => {
  applyTheme(userSettings.themeColor);
  applyLayout(userSettings.layout);
  applyTrainingMode(userSettings.trainingMode);
  updateKanaList();
  updateInputPlaceholder();

  // 监听输入，控制 Placeholder 隐藏（作为辅助，主要靠 CSS :focus）
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

  // 逆向模式下，只显示用户选择的假名类型
  if (userSettings.trainingMode === 'reverse') {
    const reverseFormMap = { 'hiragana': '平假名', 'katakana': '片假名' };
    const targetForm = reverseFormMap[userSettings.reverseKanaForm];
    filteredKanaList = filteredKanaList.filter(k => k.form === targetForm);
  }

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

  // 根据训练模式显示不同内容
  if (userSettings.trainingMode === 'forward') {
    // 正向模式：显示假名
    kanaDisplay.textContent = currentKana.kana;
  } else {
    // 逆向模式：显示罗马字
    const romanjiArray = Array.isArray(currentKana.romanji) ? currentKana.romanji : [currentKana.romanji];
    // 显示第一个罗马字作为标准
    kanaDisplay.textContent = romanjiArray[0];
  }

  // 关键修复：先聚焦，确立 :focus 状态
  romanjiInput.focus();
  // 再清空内容，此时 :focus 生效，placeholder 保持隐藏
  romanjiInput.value = '';
  romanjiInput.classList.remove('has-value');
  feedbackDisplay.textContent = '';
  kanaCard.classList.remove('shake');
}

function checkAnswer() {
  if (!currentKana) return;

  if (userSettings.trainingMode === 'forward') {
    // 正向模式：验证罗马字输入
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
  } else {
    // 逆向模式：验证假名输入
    const input = romanjiInput.value.trim();

    // 根据用户选择的假名类型获取正确的假名
    const reverseFormMap = { 'hiragana': '平假名', 'katakana': '片假名' };
    const targetForm = reverseFormMap[userSettings.reverseKanaForm];
    const correctKana = currentKana.kana;

    // 严格匹配：用户输入必须与正确假名完全一致
    if (input === correctKana) {
      feedbackDisplay.textContent = "正确！";
      feedbackDisplay.style.color = "var(--success)";
      setTimeout(nextKana, 400);
    } else {
      feedbackDisplay.textContent = `错误：应为 ${correctKana}`;
      feedbackDisplay.style.color = "var(--error)";
      kanaCard.classList.add('shake');
      setTimeout(() => kanaCard.classList.remove('shake'), 500);
    }
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
    card.innerHTML = `${kana.kana} <br> ${romanjiText}`;
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

// --- 训练模式 ---
function applyTrainingMode(mode) {
  userSettings.trainingMode = mode;

  // 更新设置面板中的选择状态
  modeChips.forEach(chip => {
    if (chip.dataset.value === mode) {
      chip.classList.add('selected');
    } else {
      chip.classList.remove('selected');
    }
  });

  // 逆向模式下显示/隐藏假名类型选择器
  const reverseFormSection = document.getElementById('reverse-form-section');
  if (reverseFormSection) {
    if (mode === 'reverse') {
      reverseFormSection.classList.remove('hidden');
    } else {
      reverseFormSection.classList.add('hidden');
    }
  }

  // 更新占位符
  updateInputPlaceholder();

  // 如果当前有显示的假名卡，重新加载
  if (currentKana) {
    nextKana();
  }
}

// --- 逆向模式假名类型 ---
function applyReverseKanaForm(form) {
  userSettings.reverseKanaForm = form;

  // 更新设置面板中的选择状态
  const reverseFormChips = document.querySelectorAll('#reverse-form-options .filter-chip');
  reverseFormChips.forEach(chip => {
    if (chip.dataset.value === form) {
      chip.classList.add('selected');
    } else {
      chip.classList.remove('selected');
    }
  });

  // 如果在逆向模式，重新加载列表
  if (userSettings.trainingMode === 'reverse') {
    updateKanaList();
  }
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

  // 应用训练模式
  const modeChip = document.querySelector('#mode-options .filter-chip.selected');
  if (modeChip) applyTrainingMode(modeChip.dataset.value);

  // 应用逆向模式假名类型
  const reverseFormChip = document.querySelector('#reverse-form-options .filter-chip.selected');
  if (reverseFormChip) applyReverseKanaForm(reverseFormChip.dataset.value);

  updateKanaList();
  settingsDialogOverlay.classList.add('hidden');
});

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    const parent = chip.parentElement;
    if (parent.id === 'layout-options' || parent.id === 'mode-options' || parent.id === 'reverse-form-options') {
      // 单选模式（布局、模式和逆向假名类型选项）
      parent.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    } else {
      // 多选模式（假名形式和类型）
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

function toggleDarkMode(isDark) {
  userSettings.isDarkMode = isDark;
  if (isDark) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  applyTheme(userSettings.themeColor);
}