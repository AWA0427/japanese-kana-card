// 全局变量
let selectedKanaType = ''; // 记录用户选择的平/片假名
let currentRomanji = '';
// 罗马音-假名映射（仅用于验证，无任何自动转换逻辑）
const kanaMap = {
  hiragana: {
    'a':'あ', 'i':'い', 'u':'う', 'e':'え', 'o':'お',
    'ka':'か', 'ki':'き', 'ku':'く', 'ke':'け', 'ko':'こ',
    'sa':'さ', 'shi':'し', 'su':'す', 'se':'せ', 'so':'そ'
  },
  katakana: {
    'a':'ア', 'i':'イ', 'u':'ウ', 'e':'エ', 'o':'オ',
    'ka':'カ', 'ki':'キ', 'ku':'ク', 'ke':'ケ', 'ko':'コ',
    'sa':'サ', 'shi':'シ', 'su':'ス', 'se':'セ', 'so':'ソ'
  }
};

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
  // 元素获取
  const modal = document.getElementById('kana-type-modal');
  const hiraBtn = document.getElementById('hiragana-btn');
  const kataBtn = document.getElementById('katakana-btn');
  const kanaInput = document.getElementById('kana-input');
  const submitBtn = document.getElementById('submit-btn');
  const feedbackText = document.getElementById('feedback-text');
  const themeSelect = document.getElementById('theme');
  const fontSizeSlider = document.getElementById('font-size');
  const fontSizeValue = document.getElementById('font-size-value');
  const resetBtn = document.getElementById('reset-progress');

  // 1. 逆向模式：先选择平/片假名再开始练习
  hiraBtn.addEventListener('click', () => {
    selectedKanaType = 'hiragana';
    modal.style.display = 'none';
    initPractice();
  });

  kataBtn.addEventListener('click', () => {
    selectedKanaType = 'katakana';
    modal.style.display = 'none';
    initPractice();
  });

  // 2. 提交验证：仅对比所选类型的假名，同一罗马音不报错
  submitBtn.addEventListener('click', validateInput);
  // 回车提交（移动端输入优化）
  kanaInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      validateInput();
    }
  });

  // 3. 设置界面交互优化
  // 主题切换
  themeSelect.addEventListener('change', () => {
    document.body.className = `${themeSelect.value}-theme`;
    localStorage.setItem('selectedTheme', themeSelect.value);
  });

  // 字体大小调整
  fontSizeSlider.addEventListener('input', () => {
    const size = fontSizeSlider.value;
    fontSizeValue.textContent = `${size}px`;
    document.body.style.fontSize = `${size}px`;
    localStorage.setItem('fontSize', size);
  });

  // 重置进度
  resetBtn.addEventListener('click', () => {
    if (confirm('确定要重置练习进度吗？')) {
      initPractice();
      feedbackText.textContent = '';
      kanaInput.value = '';
    }
  });

  // 4. 移动端输入体验优化：聚焦时滚动到练习区
  kanaInput.addEventListener('focus', () => {
    setTimeout(() => {
      const practiceSection = document.querySelector('.practice-section');
      window.scrollTo({
        top: practiceSection.offsetTop - 20,
        behavior: 'smooth'
      });
    }, 100);
  });

  // 初始化本地存储的设置
  initSettings();
});

/**
 * 初始化练习：加载随机罗马音
 */
function initPractice() {
  const romanjis = Object.keys(kanaMap[selectedKanaType]);
  currentRomanji = romanjis[Math.floor(Math.random() * romanjis.length)];
  document.getElementById('current-romanji').textContent = `罗马音：${currentRomanji}`;
}

/**
 * 验证用户输入：仅对比所选类型的假名
 */
function validateInput() {
  const kanaInput = document.getElementById('kana-input');
  const feedbackText = document.getElementById('feedback-text');
  const userInput = kanaInput.value.trim();
  const correctKana = kanaMap[selectedKanaType][currentRomanji];

  if (!userInput) {
    feedbackText.textContent = '请输入假名';
    feedbackText.style.color = '#ff5722';
    return;
  }

  if (userInput === correctKana) {
    feedbackText.textContent = '正确！🎉';
    feedbackText.style.color = '#4caf50';
    // 延迟切换下一个，让用户看到反馈
    setTimeout(() => {
      initPractice();
      kanaInput.value = '';
      feedbackText.textContent = '';
    }, 800);
  } else {
    feedbackText.textContent = `错误，正确答案：${correctKana}`;
    feedbackText.style.color = '#f44336';
  }
}

/**
 * 初始化本地存储的设置（主题、字体大小）
 */
function initSettings() {
  // 主题
  const savedTheme = localStorage.getItem('selectedTheme') || 'purple';
  document.getElementById('theme').value = savedTheme;
  document.body.className = `${savedTheme}-theme`;

  // 字体大小
  const savedFontSize = localStorage.getItem('fontSize') || 16;
  document.getElementById('font-size').value = savedFontSize;
  document.getElementById('font-size-value').textContent = `${savedFontSize}px`;
  document.body.style.fontSize = `${savedFontSize}px`;
}
